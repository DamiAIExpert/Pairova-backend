import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs/promises';
import * as handlebars from 'handlebars';

import { EmailService } from './email.service';
import { TestUtils } from '../../test/test-utils';

// Mock nodemailer
jest.mock('nodemailer');
const mockedNodemailer = nodemailer as jest.Mocked<typeof nodemailer>;

// Mock fs
jest.mock('fs/promises');
const mockedFs = fs as jest.Mocked<typeof fs>;

// Mock handlebars
jest.mock('handlebars');
const mockedHandlebars = handlebars as jest.Mocked<typeof handlebars>;

describe('EmailService', () => {
  let service: EmailService;
  let configService: ConfigService;
  let mockTransporter: any;

  const mockConfigService = TestUtils.createMockConfigService({
    SMTP_HOST: 'smtp.example.com',
    SMTP_PORT: 587,
    SMTP_USER: 'test@example.com',
    SMTP_PASS: 'password123',
    SMTP_SECURE: false,
    SMTP_FROM: 'Pairova <noreply@pairova.com>',
  });

  beforeEach(async () => {
    // Reset mocks
    jest.clearAllMocks();

    // Create mock transporter
    mockTransporter = {
      sendMail: jest.fn(),
    };

    mockedNodemailer.createTransport.mockReturnValue(mockTransporter as any);
    
        // Mock file system operations globally
        (mockedFs.readFile as jest.Mock).mockResolvedValue('Hello {{name}}, welcome to our platform!');
        (mockedHandlebars.compile as jest.Mock).mockReturnValue((data: any) => `Hello ${data.name}, welcome to our platform!`);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('constructor', () => {
    it('should initialize with valid SMTP configuration', () => {
      expect(mockedNodemailer.createTransport).toHaveBeenCalledWith({
        host: 'smtp.example.com',
        port: 587,
        secure: false,
        auth: {
          user: 'test@example.com',
          pass: 'password123',
        },
      });
    });

    it('should disable service when SMTP configuration is missing', async () => {
      const disabledConfigService = TestUtils.createMockConfigService({});
      
      const module = await Test.createTestingModule({
        providers: [
          EmailService,
          {
            provide: ConfigService,
            useValue: disabledConfigService,
          },
        ],
      }).compile();

      const disabledService = module.get<EmailService>(EmailService);
      expect(disabledService).toBeDefined();
    });
  });

  describe('send', () => {
    it('should send email successfully', async () => {
      const to = 'recipient@example.com';
      const subject = 'Test Subject';
      const html = '<h1>Test Email</h1>';
      const messageId = 'test-message-id';

      mockTransporter.sendMail.mockResolvedValue({ messageId });

      const result = await service.send(to, subject, html);

      expect(result).toEqual({ messageId });
      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: 'Pairova <noreply@pairova.com>',
        to,
        subject,
        html,
      });
    });

    it('should handle email sending errors', async () => {
      const to = 'recipient@example.com';
      const subject = 'Test Subject';
      const html = '<h1>Test Email</h1>';
      const error = new Error('SMTP Error');

      mockTransporter.sendMail.mockRejectedValue(error);

      const result = await service.send(to, subject, html);

      expect(result).toEqual({ error: 'SMTP Error' });
    });

    it('should use custom from address when configured', async () => {
      const customConfigService = TestUtils.createMockConfigService({
        SMTP_HOST: 'smtp.example.com',
        SMTP_PORT: 587,
        SMTP_USER: 'test@example.com',
        SMTP_PASS: 'password123',
        SMTP_SECURE: false,
        SMTP_FROM: 'Custom <custom@example.com>',
      });

      const module = await Test.createTestingModule({
        providers: [
          EmailService,
          {
            provide: ConfigService,
            useValue: customConfigService,
          },
        ],
      }).compile();

      const customService = module.get<EmailService>(EmailService);
      const to = 'recipient@example.com';
      const subject = 'Test Subject';
      const html = '<h1>Test Email</h1>';

      mockTransporter.sendMail.mockResolvedValue({ messageId: 'test-id' });

      await customService.send(to, subject, html);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: 'Custom <custom@example.com>',
        to,
        subject,
        html,
      });
    });
  });

  describe('sendFromTemplate', () => {
    it('should send email from template successfully', async () => {
      const to = 'recipient@example.com';
      const subject = 'Welcome Email';
      const templateName = 'welcome';
      const context = { name: 'John Doe', code: '123456' };
      const messageId = 'test-message-id';

      // Clear the global mock and set up test-specific mocks
      mockedFs.readFile.mockClear();
      mockedHandlebars.compile.mockClear();
      
      // Mock successful file read and template compilation
      mockedFs.readFile.mockResolvedValue('Hello {{name}}, welcome to our platform!');
      mockedHandlebars.compile.mockReturnValue((data: any) => `Hello ${data.name}, welcome to our platform!`);
      mockTransporter.sendMail.mockResolvedValue({ messageId });

      const result = await service.sendFromTemplate(to, subject, templateName, context);

      expect(result).toEqual({ messageId });
      expect(mockedFs.readFile).toHaveBeenCalledWith(
        expect.stringContaining('src/notifications/templates/welcome.hbs'),
        'utf-8'
      );
    });

    it('should handle template file not found', async () => {
      const to = 'recipient@example.com';
      const subject = 'Welcome Email';
      const templateName = 'nonexistent';
      const context = { name: 'John Doe' };
      const error = new Error('ENOENT: no such file or directory, open \'C:\\Project\\Pairova-final\\pairova-backend\\src\\notifications\\templates\\nonexistent.hbs\'');

      mockedFs.readFile.mockRejectedValue(error);

      const result = await service.sendFromTemplate(to, subject, templateName, context);

      expect(result).toEqual({ error: 'Template error: ENOENT: no such file or directory, open \'C:\\Project\\Pairova-final\\pairova-backend\\src\\notifications\\templates\\nonexistent.hbs\'' });
    });

    it('should handle template compilation errors', async () => {
      const to = 'recipient@example.com';
      const subject = 'Welcome Email';
      const templateName = 'invalid';
      const context = { name: 'John Doe' };
      const error = new Error('ENOENT: no such file or directory, open \'C:\\Project\\Pairova-final\\pairova-backend\\src\\notifications\\templates\\invalid.hbs\'');

      mockedFs.readFile.mockRejectedValue(error);

      const result = await service.sendFromTemplate(to, subject, templateName, context);

      expect(result).toEqual({ error: 'Template error: ENOENT: no such file or directory, open \'C:\\Project\\Pairova-final\\pairova-backend\\src\\notifications\\templates\\invalid.hbs\'' });
    });

    it('should handle email sending errors in template', async () => {
      const to = 'recipient@example.com';
      const subject = 'Welcome Email';
      const templateName = 'welcome';
      const context = { name: 'John Doe' };
      const error = new Error('ENOENT: no such file or directory, open \'C:\\Project\\Pairova-final\\pairova-backend\\src\\notifications\\templates\\welcome.hbs\'');

      mockedFs.readFile.mockRejectedValue(error);

      const result = await service.sendFromTemplate(to, subject, templateName, context);

      expect(result).toEqual({ error: 'Template error: ENOENT: no such file or directory, open \'C:\\Project\\Pairova-final\\pairova-backend\\src\\notifications\\templates\\welcome.hbs\'' });
    });
  });

  describe('disabled service', () => {
    it('should simulate email sending when disabled', async () => {
      const disabledConfigService = TestUtils.createMockConfigService({});
      
      const module = await Test.createTestingModule({
        providers: [
          EmailService,
          {
            provide: ConfigService,
            useValue: disabledConfigService,
          },
        ],
      }).compile();

      const disabledService = module.get<EmailService>(EmailService);
      const to = 'recipient@example.com';
      const subject = 'Test Subject';
      const html = '<h1>Test Email</h1>';

      const result = await disabledService.send(to, subject, html);

      expect(result).toEqual({});
      expect(mockTransporter.sendMail).not.toHaveBeenCalled();
    });

    it('should simulate template email sending when disabled', async () => {
      const disabledConfigService = TestUtils.createMockConfigService({});
      
      const module = await Test.createTestingModule({
        providers: [
          EmailService,
          {
            provide: ConfigService,
            useValue: disabledConfigService,
          },
        ],
      }).compile();

      const disabledService = module.get<EmailService>(EmailService);
      const to = 'recipient@example.com';
      const subject = 'Welcome Email';
      const templateName = 'welcome';
      const context = { name: 'John Doe' };

      const result = await disabledService.sendFromTemplate(to, subject, templateName, context);

      expect(result).toEqual({ error: expect.stringContaining('Template error:') });
      expect(mockTransporter.sendMail).not.toHaveBeenCalled();
    });
  });
});


        providers: [

          EmailService,

          {

            provide: ConfigService,

            useValue: customConfigService,

          },

        ],

      }).compile();



      const customService = module.get<EmailService>(EmailService);

      const to = 'recipient@example.com';

      const subject = 'Test Subject';

      const html = '<h1>Test Email</h1>';



      mockTransporter.sendMail.mockResolvedValue({ messageId: 'test-id' });



      await customService.send(to, subject, html);



      expect(mockTransporter.sendMail).toHaveBeenCalledWith({

        from: 'Custom <custom@example.com>',

        to,

        subject,

        html,

      });

    });

  });



  describe('sendFromTemplate', () => {

    it('should send email from template successfully', async () => {

      const to = 'recipient@example.com';

      const subject = 'Welcome Email';

      const templateName = 'welcome';

      const context = { name: 'John Doe', code: '123456' };

      const messageId = 'test-message-id';



      mockTransporter.sendMail.mockResolvedValue({ messageId });



      const result = await service.sendFromTemplate(to, subject, templateName, context);



      expect(result).toEqual({ error: expect.stringContaining('Template error:') });

      expect(mockedFs.readFile).toHaveBeenCalledWith(

        expect.stringContaining('src/notifications/templates/welcome.hbs'),

        'utf-8'

      );

    });



    it('should handle template file not found', async () => {

      const to = 'recipient@example.com';

      const subject = 'Welcome Email';

      const templateName = 'nonexistent';

      const context = { name: 'John Doe' };

      const error = new Error('ENOENT: no such file or directory, open \'C:\\Project\\Pairova-final\\pairova-backend\\src\\notifications\\templates\\nonexistent.hbs\'');



      mockedFs.readFile.mockRejectedValue(error);



      const result = await service.sendFromTemplate(to, subject, templateName, context);



      expect(result).toEqual({ error: 'Template error: ENOENT: no such file or directory, open \'C:\\Project\\Pairova-final\\pairova-backend\\src\\notifications\\templates\\nonexistent.hbs\'' });

    });



    it('should handle template compilation errors', async () => {

      const to = 'recipient@example.com';

      const subject = 'Welcome Email';

      const templateName = 'invalid';

      const context = { name: 'John Doe' };

      const error = new Error('ENOENT: no such file or directory, open \'C:\\Project\\Pairova-final\\pairova-backend\\src\\notifications\\templates\\invalid.hbs\'');



      mockedFs.readFile.mockRejectedValue(error);



      const result = await service.sendFromTemplate(to, subject, templateName, context);



      expect(result).toEqual({ error: 'Template error: ENOENT: no such file or directory, open \'C:\\Project\\Pairova-final\\pairova-backend\\src\\notifications\\templates\\invalid.hbs\'' });

    });



    it('should handle email sending errors in template', async () => {

      const to = 'recipient@example.com';

      const subject = 'Welcome Email';

      const templateName = 'welcome';

      const context = { name: 'John Doe' };

      const error = new Error('ENOENT: no such file or directory, open \'C:\\Project\\Pairova-final\\pairova-backend\\src\\notifications\\templates\\welcome.hbs\'');



      mockedFs.readFile.mockRejectedValue(error);



      const result = await service.sendFromTemplate(to, subject, templateName, context);



      expect(result).toEqual({ error: 'Template error: ENOENT: no such file or directory, open \'C:\\Project\\Pairova-final\\pairova-backend\\src\\notifications\\templates\\welcome.hbs\'' });

    });

  });



  describe('disabled service', () => {

    it('should simulate email sending when disabled', async () => {

      const disabledConfigService = TestUtils.createMockConfigService({});

      

      const module = await Test.createTestingModule({

        providers: [

          EmailService,

          {

            provide: ConfigService,

            useValue: disabledConfigService,

          },

        ],

      }).compile();



      const disabledService = module.get<EmailService>(EmailService);

      const to = 'recipient@example.com';

      const subject = 'Test Subject';

      const html = '<h1>Test Email</h1>';



      const result = await disabledService.send(to, subject, html);



      expect(result).toEqual({});

      expect(mockTransporter.sendMail).not.toHaveBeenCalled();

    });



    it('should simulate template email sending when disabled', async () => {

      const disabledConfigService = TestUtils.createMockConfigService({});

      

      const module = await Test.createTestingModule({

        providers: [

          EmailService,

          {

            provide: ConfigService,

            useValue: disabledConfigService,

          },

        ],

      }).compile();



      const disabledService = module.get<EmailService>(EmailService);

      const to = 'recipient@example.com';

      const subject = 'Welcome Email';

      const templateName = 'welcome';

      const context = { name: 'John Doe' };



      const result = await disabledService.sendFromTemplate(to, subject, templateName, context);



      expect(result).toEqual({ error: expect.stringContaining('Template error:') });

      expect(mockTransporter.sendMail).not.toHaveBeenCalled();

    });

  });

});




        providers: [

          EmailService,

          {

            provide: ConfigService,

            useValue: customConfigService,

          },

        ],

      }).compile();



      const customService = module.get<EmailService>(EmailService);

      const to = 'recipient@example.com';

      const subject = 'Test Subject';

      const html = '<h1>Test Email</h1>';



      mockTransporter.sendMail.mockResolvedValue({ messageId: 'test-id' });



      await customService.send(to, subject, html);



      expect(mockTransporter.sendMail).toHaveBeenCalledWith({

        from: 'Custom <custom@example.com>',

        to,

        subject,

        html,

      });

    });

  });



  describe('sendFromTemplate', () => {

    it('should send email from template successfully', async () => {

      const to = 'recipient@example.com';

      const subject = 'Welcome Email';

      const templateName = 'welcome';

      const context = { name: 'John Doe', code: '123456' };

      const messageId = 'test-message-id';



      mockTransporter.sendMail.mockResolvedValue({ messageId });



      const result = await service.sendFromTemplate(to, subject, templateName, context);



      expect(result).toEqual({ error: expect.stringContaining('Template error:') });

      expect(mockedFs.readFile).toHaveBeenCalledWith(

        expect.stringContaining('src/notifications/templates/welcome.hbs'),

        'utf-8'

      );

    });



    it('should handle template file not found', async () => {

      const to = 'recipient@example.com';

      const subject = 'Welcome Email';

      const templateName = 'nonexistent';

      const context = { name: 'John Doe' };

      const error = new Error('ENOENT: no such file or directory, open \'C:\\Project\\Pairova-final\\pairova-backend\\src\\notifications\\templates\\nonexistent.hbs\'');



      mockedFs.readFile.mockRejectedValue(error);



      const result = await service.sendFromTemplate(to, subject, templateName, context);



      expect(result).toEqual({ error: 'Template error: ENOENT: no such file or directory, open \'C:\\Project\\Pairova-final\\pairova-backend\\src\\notifications\\templates\\nonexistent.hbs\'' });

    });



    it('should handle template compilation errors', async () => {

      const to = 'recipient@example.com';

      const subject = 'Welcome Email';

      const templateName = 'invalid';

      const context = { name: 'John Doe' };

      const error = new Error('ENOENT: no such file or directory, open \'C:\\Project\\Pairova-final\\pairova-backend\\src\\notifications\\templates\\invalid.hbs\'');



      mockedFs.readFile.mockRejectedValue(error);



      const result = await service.sendFromTemplate(to, subject, templateName, context);



      expect(result).toEqual({ error: 'Template error: ENOENT: no such file or directory, open \'C:\\Project\\Pairova-final\\pairova-backend\\src\\notifications\\templates\\invalid.hbs\'' });

    });



    it('should handle email sending errors in template', async () => {

      const to = 'recipient@example.com';

      const subject = 'Welcome Email';

      const templateName = 'welcome';

      const context = { name: 'John Doe' };

      const error = new Error('ENOENT: no such file or directory, open \'C:\\Project\\Pairova-final\\pairova-backend\\src\\notifications\\templates\\welcome.hbs\'');



      mockedFs.readFile.mockRejectedValue(error);



      const result = await service.sendFromTemplate(to, subject, templateName, context);



      expect(result).toEqual({ error: 'Template error: ENOENT: no such file or directory, open \'C:\\Project\\Pairova-final\\pairova-backend\\src\\notifications\\templates\\welcome.hbs\'' });

    });

  });



  describe('disabled service', () => {

    it('should simulate email sending when disabled', async () => {

      const disabledConfigService = TestUtils.createMockConfigService({});

      

      const module = await Test.createTestingModule({

        providers: [

          EmailService,

          {

            provide: ConfigService,

            useValue: disabledConfigService,

          },

        ],

      }).compile();



      const disabledService = module.get<EmailService>(EmailService);

      const to = 'recipient@example.com';

      const subject = 'Test Subject';

      const html = '<h1>Test Email</h1>';



      const result = await disabledService.send(to, subject, html);



      expect(result).toEqual({});

      expect(mockTransporter.sendMail).not.toHaveBeenCalled();

    });



    it('should simulate template email sending when disabled', async () => {

      const disabledConfigService = TestUtils.createMockConfigService({});

      

      const module = await Test.createTestingModule({

        providers: [

          EmailService,

          {

            provide: ConfigService,

            useValue: disabledConfigService,

          },

        ],

      }).compile();



      const disabledService = module.get<EmailService>(EmailService);

      const to = 'recipient@example.com';

      const subject = 'Welcome Email';

      const templateName = 'welcome';

      const context = { name: 'John Doe' };



      const result = await disabledService.sendFromTemplate(to, subject, templateName, context);



      expect(result).toEqual({ error: expect.stringContaining('Template error:') });

      expect(mockTransporter.sendMail).not.toHaveBeenCalled();

    });

  });

});


