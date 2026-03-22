import React, { useEffect, useRef, useState } from 'react';
import { assets } from '../../assets/assets';
import uniqid from 'uniqid';
import Quill from 'quill';

const AddCourse = () => {
  // 1. Quill Editor Refs
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  // 2. Form State Variables
  const [courseTitle, setCourseTitle] = useState('');
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);

  // 3. Popup & Lecture State Variables
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    isPreviewFree: false
  });

  // 4. Initialize Quill Editor only once
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow'
      });
    }
  }, []);

  // 5. Handle Chapter Actions (Add, Remove, Toggle)
  const handleChapter = (action, chapterId) => {
    if (action === 'add') {
      const title = prompt('Enter Chapter Name:');
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: chapters.length > 0 ? chapters.slice(-1).chapterOrder + 1 : 1
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === 'remove') {
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
    } else if (action === 'toggle') {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId ? { ...chapter, collapsed: !chapter.collapsed } : chapter
        )
      );
    }
  };

  // 6. Handle Lecture Actions (Open Popup, Remove Lecture)
  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === 'add') {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === 'remove') {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            chapter.chapterContent.splice(lectureIndex, 1);
          }
          return chapter;
        })
      );
    }
  };

  // 7. Add Lecture from Popup to the selected Chapter
  const addLecture = () => {
    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetails,
            lectureOrder: chapter.chapterContent.length > 0 ? chapter.chapterContent.slice(-1).lectureOrder + 1 : 1,
            lectureId: uniqid()
          };
          chapter.chapterContent.push(newLecture);
        }
        return chapter;
      })
    );
    setShowPopup(false);
    setLectureDetails({
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      isPreviewFree: false
    });
  };

  // 8. Submit Course Form Placeholder (Before Backend Integration)
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Backend integration will go here later
    console.log("Form submitted. Course Data ready for API.");
  };

  return (
    <div className="h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-md w-full text-gray-500">

        {/* Course Title */}
        <div className="flex flex-col gap-1">
          <p>Course Title</p>
          <input
            type="text"
            onChange={(e) => setCourseTitle(e.target.value)}
            value={courseTitle}
            placeholder="Type here"
            className="bg-gray-50 border border-gray-500/20 px-3 py-2 rounded outline-none"
            required
          />
        </div>

        {/* Course Description (Quill Editor) */}
        <div className="flex flex-col gap-1">
          <p>Course Description</p>
          <div ref={editorRef} className="bg-gray-50 border border-gray-500/20 rounded outline-none h-24 overflow-hidden"></div>
        </div>

        {/* Course Price & Thumbnail */}
        <div className="flex items-center justify-between flex-wrap gap-5">
          <div className="flex flex-col gap-1">
            <p>Course Price</p>
            <input
              type="number"
              onChange={(e) => setCoursePrice(e.target.value)}
              value={coursePrice}
              placeholder="0"
              className="bg-gray-50 border border-gray-500/20 px-3 py-2 rounded outline-none w-28"
              required
            />
          </div>

          <div className="flex md:flex-row flex-col items-center gap-3">
            <p>Course Thumbnail</p>
            <label htmlFor="thumbnailImage" className="cursor-pointer">
              <img src={image ? URL.createObjectURL(image) : assets.file_upload_icon} alt="upload icon" className="w-16 h-16 bg-gray-50 border border-gray-500/20 rounded object-cover" />
              <input
                type="file"
                id="thumbnailImage"
                onChange={(e) => setImage(e.target.files)}
                accept="image/*"
                hidden
              />
            </label>
          </div>
        </div>

        {/* Discount */}
        <div className="flex flex-col gap-1">
          <p>Discount %</p>
          <input
            type="number"
            onChange={(e) => setDiscount(e.target.value)}
            value={discount}
            placeholder="0"
            min="0"
            max="100"
            className="bg-gray-50 border border-gray-500/20 px-3 py-2 rounded outline-none w-28"
          />
        </div>

        {/* Adding Chapters and Lectures */}
        <div>
          {chapters.map((chapter, chapterIndex) => (
            <div key={chapterIndex} className="bg-white border border-gray-500/20 rounded mb-4">
              <div className="flex justify-between items-center p-4 border-b border-gray-500/20">
                <div className="flex items-center gap-2">
                  <img
                    src={assets.dropdown_icon}
                    alt="dropdown"
                    onClick={() => handleChapter('toggle', chapter.chapterId)}
                    className={`w-4 cursor-pointer transform transition-transform ${chapter.collapsed ? '-rotate-90' : ''}`}
                  />
                  <span className="font-semibold">Chapter {chapterIndex + 1}: {chapter.chapterTitle}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-500">{chapter.chapterContent.length} Lectures</span>
                  <img
                    src={assets.cross_icon}
                    alt="remove chapter"
                    onClick={() => handleChapter('remove', chapter.chapterId)}
                    className="w-4 cursor-pointer"
                  />
                </div>
              </div>

              {/* Lectures List */}
              {!chapter.collapsed && (
                <div className="p-4">
                  {chapter.chapterContent.map((lecture, lectureIndex) => (
                    <div key={lectureIndex} className="flex justify-between items-center mb-2 text-sm text-gray-600">
                      <span className="truncate flex-1">{lectureIndex + 1}. {lecture.lectureTitle}</span>
                      <div className="flex items-center gap-3">
                        <span>{lecture.lectureDuration} mins</span>
                        <a href={lecture.lectureUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">Link</a>
                        <span className={`${lecture.isPreviewFree ? 'text-green-500' : 'text-gray-500'}`}>
                          {lecture.isPreviewFree ? 'Free Preview' : 'Paid'}
                        </span>
                        <img
                          src={assets.cross_icon}
                          alt="remove lecture"
                          onClick={() => handleLecture('remove', chapter.chapterId, lectureIndex)}
                          className="w-3 cursor-pointer"
                        />
                      </div>
                    </div>
                  ))}

                  <div
                    onClick={() => handleLecture('add', chapter.chapterId)}
                    className="inline-block mt-2 bg-gray-100 px-3 py-1 rounded cursor-pointer text-sm font-medium"
                  >
                    + Add Lecture
                  </div>
                </div>
              )}
            </div>
          ))}

          <div
            onClick={() => handleChapter('add')}
            className="bg-blue-50 text-blue-600 text-center px-4 py-2 w-full rounded cursor-pointer font-medium border border-blue-200 inline-block"
          >
            + Add Chapter
          </div>
        </div>

        <button type="submit" className="bg-black text-white px-8 py-3 rounded mt-4 w-fit">
          ADD
        </button>
      </form>

      {/* Popup for adding lectures */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
            <img
              src={assets.cross_icon}
              alt="close"
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 w-4 cursor-pointer"
            />
            <h2 className="text-xl font-semibold mb-4">Add Lecture</h2>

            <div className="mb-3">
              <p className="mb-1 text-sm">Lecture Title</p>
              <input
                type="text"
                value={lectureDetails.lectureTitle}
                onChange={(e) => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 outline-none"
              />
            </div>

            <div className="mb-3">
              <p className="mb-1 text-sm">Duration (minutes)</p>
              <input
                type="number"
                value={lectureDetails.lectureDuration}
                onChange={(e) => setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 outline-none"
              />
            </div>

            <div className="mb-3">
              <p className="mb-1 text-sm">Lecture URL (YouTube)</p>
              <input
                type="text"
                value={lectureDetails.lectureUrl}
                onChange={(e) => setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 mb-5">
              <input
                type="checkbox"
                checked={lectureDetails.isPreviewFree}
                onChange={(e) => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })}
              />
              <p className="text-sm">Is Preview Free?</p>
            </div>

            <button type="button" onClick={addLecture} className="bg-blue-600 text-white px-4 py-2 rounded w-full">
              ADD
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCourse;
