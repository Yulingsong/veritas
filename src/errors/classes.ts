/**
 * Veritas Error Classes
 */

export class VeritasError extends Error {
  code?: string;
  details?: any;

  constructor(message: string, code?: string, details?: any) {
    super(message);
    this.name = 'VeritasError';
    this.code = code;
    this.details = details;
  }
}

export class ValidationError extends VeritasError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class GenerationError extends VeritasError {
  constructor(message: string, details?: any) {
    super(message, 'GENERATION_ERROR', details);
    this.name = 'GenerationError';
  }
}

export class ExecutionError extends VeritasError {
  constructor(message: string, details?: any) {
    super(message, 'EXECUTION_ERROR', details);
    this.name = 'ExecutionError';
  }
}

export class ConfigurationError extends VeritasError {
  constructor(message: string, details?: any) {
    super(message, 'CONFIG_ERROR', details);
    this.name = 'ConfigurationError';
  }
}

export class NetworkError extends VeritasError {
  constructor(message: string, details?: any) {
    super(message, 'NETWORK_ERROR', details);
    this.name = 'NetworkError';
  }
}

export class ParseError extends VeritasError {
  constructor(message: string, details?: any) {
    super(message, 'PARSE_ERROR', details);
    this.name = 'ParseError';
  }
}

/**
 * Error factory
 */
export function createError(
  type: 'validation' | 'generation' | 'execution' | 'configuration' | 'network' | 'parse',
  message: string,
  details?: any
): VeritasError {
  const errorMap = {
    validation: ValidationError,
    generation: GenerationError,
    execution: ExecutionError,
    configuration: ConfigurationError,
    network: NetworkError,
    parse: ParseError
  };

  return new errorMap[type](message, details);
}
