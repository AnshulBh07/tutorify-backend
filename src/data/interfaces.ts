import { ObjectId } from "mongoose";

export interface IReview {
  _id?: ObjectId;
  rating: number;
  comment: string;
  reviewer: ObjectId | IUser;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITutor {
  _id: ObjectId;
  native_language: string;
  tutor_type: string;
  languages_taught: string[];
  hourly_rate: number;
  number_of_students: number;
  intro: string;
  demo_rate: number;
  number_of_lessons: number;
  status: string;
  reviews: IReview[];
  user: ObjectId | IUser;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IAddress {
  _id: ObjectId;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  country: string;
  postal_code: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IUser {
  _id: ObjectId;
  first_name: string;
  last_name?: string;
  email: string;
  password: string;
  salt: string;
  dob?: Date;
  profile_pic: string;
  gender: string;
  phone_number?: string;
  isTutor: boolean;
  address?: IAddress;
  otp?: number;
  otp_expire?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITutorFetch {
  _id: ObjectId;
  native_language: string;
  tutor_type: string;
  languages_taught: string[];
  hourly_rate: number;
  number_of_students: number;
  intro: string;
  demo_rate: number;
  number_of_lessons: number;
  status: string;
  reviews: IReview[];
  instant_rate: boolean;
  auto_accept: boolean;
  user: IUser;
  createdAt?: Date;
  updatedAt?: Date;
}
