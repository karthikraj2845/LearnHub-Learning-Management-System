import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from "../../context/AppContext";
import { assets } from '../../assets/assets';

const CourseCard = ({ course }) => {
  // Access currency and rating calculator from the global context
  const { currency, calculateRating } = useContext(AppContext);

  return (
    <Link
      to={'/course/' + course._id}
      onClick={() => window.scrollTo(0, 0)}
      className="border border-gray-500/30 pb-6 overflow-hidden rounded-lg"
    >
      <img className="w-full" src={course.courseThumbnail} alt="Course Thumbnail" />
      <div className="p-4 text-left">
        <h3 className="text-base font-semibold">{course.courseTitle}</h3>
        <p className="text-gray-500">{course.educator.name}</p>
        <div className="flex items-center space-x-2">
          <p>4.5</p>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={assets.star}
                alt="star"
                className="w-3.5 h-3.5"
              />
            ))}
          </div>
          <p className="text-gray-500">22</p>
        </div>
        <p className="text-base font-semibold text-gray-800">
          {currency}{((course.coursePrice - (course.discount * course.coursePrice / 100))*10).toFixed(1)}
        </p>
      </div>
    </Link>
  );
};

export default CourseCard;
