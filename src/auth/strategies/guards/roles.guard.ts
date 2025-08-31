/**
 * @file roles.guard.ts
 * @description This file re-exports the core RolesGuard from the common module.
 * This pattern promotes a clean, domain-driven structure while allowing shared guards
 * to be maintained in a single, central location (`src/common/guards`).
 */
export * from '../../../common/guards/roles.guard';

