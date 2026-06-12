"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import styles from "./blog.module.css";

export default function BlogContent() {
  // @ts-ignore - blogs module will be available after convex dev
  const blogs = useQuery(api.blogs?.listAllBlogs);

  if (blogs === undefined) {
    return <div className={styles.loading}>Loading blogs...</div>;
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No blogs available yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className={styles.blogGrid}>
      {blogs.map((blog: any) => (
        <Link
          key={blog._id}
          href={`/blog/${blog.slug}`}
          className={styles.blogCard}
        >
          <div className={styles.cardContent}>
            <h3 className={styles.blogTitle}>{blog.title}</h3>

            <div className={styles.metadata}>
              {blog.ncertBook && (
                <span className={styles.badge}>
                  {blog.ncertBook}
                </span>
              )}
              {blog.ncertChapter && (
                <span className={styles.badge}>
                  {blog.ncertChapter}
                </span>
              )}
            </div>

            <div className={styles.infoRow}>
              {blog.targetClasses && blog.targetClasses.length > 0 && (
                <span className={styles.info}>
                  Classes: {blog.targetClasses.join(", ")}
                </span>
              )}
            </div>

            {blog.estimatedStudyTime && (
              <div className={styles.infoRow}>
                <span className={styles.info}>
                  ⏱ {blog.estimatedStudyTime} min read
                </span>
              </div>
            )}

            <div className={styles.cta}>
              Read More →
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
