import { Space } from '../../../../types/common';
import { JsonError, MissingAttributeError } from '../handleErrors';

// Add validation for the space schema
export const validateSpaceSchema = (space: Space) => {
  const { id, name, location } = space;

  if (!id) {
    throw new MissingAttributeError('id');
  }
  if (!name) {
    throw new MissingAttributeError('name');
  }
  if (!location) {
    throw new MissingAttributeError('location');
  }
};

export const parseJsonBodyValidator = (args: string) => {
  try {
    return JSON.parse(args);
  } catch (error: any) {
    throw new JsonError(error.message);
  }
};
