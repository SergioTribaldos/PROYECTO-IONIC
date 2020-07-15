import { Condition } from '../model/product';

export const setConditionClass = (condition) => {
  switch (condition) {
    case Condition.mint:
      return 'success';
      break;
    case Condition.semi_new:
      return 'warning';
      break;
    case Condition.used:
      return 'danger';
      break;
  }
};
