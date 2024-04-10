import { ITutorFetch } from "../data/interfaces";

const sortByPopularity = (a: ITutorFetch, b: ITutorFetch) => {
  if (a.number_of_students < b.number_of_students) return 1;
  if (a.number_of_students > b.number_of_students) return -1;
  return 0;
};

const sortByRating = (a: ITutorFetch, b: ITutorFetch) => {
  //   first calculate average rating of both tutors
  const n = a.reviews.length;
  const m = b.reviews.length;
  let ratingA = 0,
    ratingB = 0;

  for (let i = 0; i < n; i++) {
    ratingA += a.reviews[i].rating;
  }

  for (let i = 0; i < m; i++) {
    ratingB += b.reviews[i].rating;
  }

  ratingA = ratingA / n;
  ratingB = ratingB / m;

  if (ratingA < ratingB) return 1;
  if (ratingB < ratingA) return -1;
  return 0;
};

// gets from high to low
const sortByPrice = (a: ITutorFetch, b: ITutorFetch) => {
  if (a.hourly_rate < b.hourly_rate) return 1;
  if (a.hourly_rate > b.hourly_rate) return -1;
  return 0;
};

// sorts high to low
const sortByDemoPrice = (a: ITutorFetch, b: ITutorFetch) => {
  if (a.demo_rate < b.demo_rate) return 1;
  if (a.demo_rate > b.demo_rate) return -1;
  return 0;
};

const sortByLanguages = (a: ITutorFetch, b: ITutorFetch) => {
  if (a.languages_taught.length < b.languages_taught.length) return 1;
  if (a.languages_taught.length > b.languages_taught.length) return -1;
  return 0;
};

export const sortTutors: (arr: ITutorFetch[], a: string) => ITutorFetch[] = (
  tutors: ITutorFetch[],
  criteria
) => {
  // a switch case that handles the sorting based on criteria
  let sortedArr: ITutorFetch[] = tutors;

  switch (criteria) {
    case "popularity":
      sortedArr = sortedArr.sort(sortByPopularity);
      return sortedArr;
    case "rating":
      sortedArr = sortedArr.sort(sortByRating);
      return sortedArr;
    case "price1": //low to high
      sortedArr = sortedArr.sort(sortByPrice);
      sortedArr = sortedArr.reverse();
      return sortedArr;
    case "price2": //high to low
      sortedArr = sortedArr.sort(sortByPrice);
      return sortedArr;
    case "experience":
      return sortedArr;
    case "demo_price1": //low to high
      sortedArr = sortedArr.sort(sortByDemoPrice);
      sortedArr = sortedArr.reverse();
      return sortedArr;
    case "demo_price2": //high to low
      sortedArr = sortedArr.sort(sortByDemoPrice);
      return sortedArr;
    case "languages":
      sortedArr = sortedArr.sort(sortByLanguages);
    default:
      return sortedArr;
  }
};
