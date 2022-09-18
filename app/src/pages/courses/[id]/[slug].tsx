import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import AddCourseToRoadmap from '~/components/AddCourseToRoadmap';
import { CompleteCourse } from '~/components/CompleteCourse';
import CourseCard from '~/components/CourseCard';
import LevelPill from '~/components/ui/LevelPill';
import { BROWSE_COURSES_ITEMS } from '~/utils/constants';
import { trpc } from '~/utils/trpc';
import { FaCogs } from 'react-icons/fa';
import { AiFillTags } from 'react-icons/ai';
import { MdGrade } from 'react-icons/md';

const CoursePage: NextPage = () => {
  const id = Number(useRouter().query.id);
  const { data: course, isLoading } = trpc.useQuery(['courses.byId', { id }]);

  const { data: session } = useSession();

  const { data: userCourses } = trpc.useQuery(
    ['usercourses.all', { userId: session?.user.userId || -1 }],
    {
      enabled: !!session,
    }
  );

  const { data: relatedResources } = trpc.useQuery(
    [
      'resources.related',
      {
        tags: course?.content.tags.map((t) => t.slug),
        technologies: course?.content.technologies.map((t) => t.slug),
      },
    ],
    {
      enabled: !!course,
    }
  );

  const { data: relatedCourses } = trpc.useQuery(
    [
      'courses.related',
      {
        tags: course?.content.tags.map((t) => t.slug),
        technologies: course?.content.technologies.map((t) => t.slug),
        excludeCourseId: course?.id,
      },
    ],
    {
      enabled: !!course,
    }
  );

  const completed =
    (course &&
      !!userCourses?.find((c) => c.courseId === course.id && c.completed)) ||
    false;

  const inRoadmap =
    (course &&
      !!userCourses?.find((c) => c.courseId === course.id && c.roadmap)) ||
    false;

  if (isLoading) {
    return <div>Loading</div>;
  }

  return course ? (
    <div>
      <div className="px-[5.5rem]">
        <div className="flex flex-col py-8 ">
          <h1 className="mb-4 text-4xl font-bold">{course.content.title}</h1>
          <div className="flex-start flex items-center gap-x-4">
            <div className="flex gap-x-2">
              <MdGrade className="text-2xl text-secondary-500" />
              {course.levels.map((t) => (
                <LevelPill
                  key={`course-tech-${t.id}`}
                  level={t.name}
                  url={`/courses/browse/level/${t.slug}`}
                />
              ))}
            </div>

            {/* Become An Ethereum Blockchain Developer With One Course. Master */}
            <div className="flex gap-x-2">
              <FaCogs className="text-2xl text-secondary-500" />
              {course.content.technologies.map((t) => (
                <LevelPill
                  key={`course-tech-${t.id}`}
                  level={t.name}
                  url={`/courses/browse/tech/${t.slug}`}
                />
              ))}
            </div>
            <div className="flex gap-x-2">
              <AiFillTags className="text-2xl text-secondary-500" />
              {course.content.tags.map((t) => (
                <LevelPill
                  key={`course-tech-${t.id}`}
                  level={t.name}
                  url={`/courses/browse/tag/${t.slug}`}
                />
              ))}
            </div>
          </div>
        </div>
        {/* hero image */}
        <div className="relative flex h-[200px] w-full items-center justify-center rounded-md bg-main-gray-light sm:h-[300px] md:h-[400px] lg:h-[600px]">
          {course.content.coverImageUrl && (
            <Image
              alt="thumbnail"
              src={course.content.coverImageUrl}
              layout="fill"
              objectFit="contain"
            />
          )}
          {/* play button */}
          {/* <div className="h-14 w-14 rounded-full bg-secondary-400 shadow-md"></div> */}
        </div>
        {/* Intro and desc */}
        <div className="mt-6 flex flex-col space-y-6">
          {/* <div className="flex flex-col space-y-2">
            <h1 className="mb-0 text-3xl font-semibold">Introduction</h1>
            <p className="max-w-5xl font-light">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Distinctio, nulla impedit quaerat debitis cupiditate omnis
              veritatis, asperiores vel quae qui quia praesentium blanditiis,
              itaque quam ipsum deserunt placeat porro. Vitae, ipsa cumque?
            </p>
          </div> */}
          <div className="flex flex-col space-y-2">
            <h1 className="mb-0 text-3xl font-semibold">Description</h1>
            <p className="max-w-5xl font-light">{course.content.description}</p>
          </div>
        </div>
        {session && (
          <div className="grid 2xl:grid-cols-3">
            <AddCourseToRoadmap
              courseId={course.id}
              inRoadmap={inRoadmap}
              type="standard"
            />
            <CompleteCourse
              courseId={course.id}
              user={session.user}
              completed={completed}
            />

            <button className="mt-8 w-96 rounded-[6.5px] bg-primary-400 px-10 py-2 font-bold text-white disabled:bg-gray-500">
              Take final test
            </button>
          </div>
        )}
      </div>
      {/* Course Carousel */}
      {/* 
      <div className="bg-main-gray-light pt-2 pb-4">
        <div className="px-[5.5rem]">
          <CourseCarousel title={`Top 10 ${topic} Courses`} courses={courses} />
        </div>
      </div> */}

      {/* Related courses */}
      <div className="px-[5.5rem]">
        {/* header */}
        <div className="flex flex-col py-8">
          <h1 className="mt-8 text-4xl">Related Courses</h1>
        </div>
        {/* Grid */}
        <div className="grid grid-cols-3 gap-6">
          {relatedCourses?.map((course) => (
            <CourseCard key={`related-courses-${course.id}`} course={course} />
          ))}
        </div>
        {/* show more */}
        {/* TODO: manage pagination properly */}
        {relatedCourses?.length === BROWSE_COURSES_ITEMS && (
          <div className="my-10 w-full bg-main-gray-light py-2 text-center text-xl font-medium">
            Show More Courses
          </div>
        )}
      </div>

      {/* Related resources */}
      <div className="px-[5.5rem]">
        <div className="my-10 w-full space-y-4">
          <h1 className="mt-8 text-4xl">Related Resources</h1>
          <div className="grid grid-cols-3 gap-4">
            {relatedResources?.map((res) => (
              <Link
                href={`/resources/${res.id}/${res.slug}`}
                key={`related-resources-${res.id}`}
              >
                <button className="flex justify-between rounded-md bg-main-gray-light py-2 px-4">
                  <p className="">{res.title}</p>
                </button>
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-col">
          <h1 className="text-4xl">Something about the community</h1>
          <div className="flex space-x-8">
            <div className="min-h-[353px] min-w-[60%]  rounded-lg bg-main-gray-dark text-white"></div>
            <div className="flex flex-col space-y-4">
              <p className="font-semibold">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry&apos;s standard
                dummy text ever since the.
              </p>
              <p className="font-[350]">
                There are many variations of passages of Lorem Ipsum available,
                but the majority have suffered alteration in some form, by
                injected humour, or randomised words which don&apos;t look even
                slightly believable. If you are going to use a passage of Lorem
                Ipsum, you need to be sure there isn&apos;t anything
                embarrassing hidden in the middle of text.
              </p>
              <div className="flex justify-between rounded-md bg-main-gray-light py-2 px-4">
                <p>Go somewhere else</p>
                <p className="font-normal">&#62;</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div>No course found</div>
  );
};

export default CoursePage;
