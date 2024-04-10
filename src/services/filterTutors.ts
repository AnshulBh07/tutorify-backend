import { ITutorFetch } from "../data/interfaces";

// check whether each filtering field exists, if it does then filter the arr
export const filterTutors = (tutors: ITutorFetch[], query: any) => {
  let filteredArr: ITutorFetch[] = tutors;

  if (typeof query.from !== "undefined") {
    const from = query.from.toString();
    filteredArr = filteredArr.filter((item) => {
      return item.user.address!.country === from;
    });
  }

  if (typeof query.also_speaks !== "undefined") {
    // extract also speaks and console to test
    const also_speaks = query.also_speaks.toString().split(",");

    // now filter all the results that contains all of these in languages taught
    filteredArr = filteredArr.filter((item) => {
      for (let i = 0; i < also_speaks.length; i++) {
        if (!item.languages_taught.includes(also_speaks[i])) {
          return false;
        }
      }
      return true;
    });
  }

  if (typeof query.price !== "undefined") {
    const price = query.price.toString().split(",");
    // console.log(price);

    filteredArr = filteredArr.filter((item) => {
      return (
        item.hourly_rate >= Number(price[0]) &&
        item.hourly_rate <= Number(price[1])
      );
    });
  }

  if (typeof query.native_speaker !== "undefined") {
    const native_speaker = query.native_speaker.toString();

    filteredArr = filteredArr.filter((item) => {
      return item;
    });
  }

  if (typeof query.teacher_type !== "undefined") {
    const teacher_type = query.teacher_type.toString();

    filteredArr = filteredArr.filter((item) => {
      return item.tutor_type === teacher_type;
    });
  }

  if (typeof query.category !== "undefined") {
    const category = query.category.toString();

    filteredArr.filter((item) => {
      return item.languages_taught.includes(category);
    });
  }

  return filteredArr;
};
