import UserType from './UserType';

interface StaffType extends UserType {
  password: string;
  username: string;
}

export default StaffType;
