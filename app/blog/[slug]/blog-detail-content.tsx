"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import styles from "./detail.module.css";

interface BlogDetailContentProps {
  slug: string;
}

export default function BlogDetailContent({ slug }: BlogDetailContentProps) {
  // @ts-ignore - blogs module will be available after convex dev
  const blog = useQuery(api.blogs?.getBlogBySlug, { slug });

  if (blog === undefined) {
    return <div className={styles.loading}>Loading blog...</div>;
  }

  if (!blog) {
    return (
      <div className={styles.notFound}>
        <h2>Blog not found</h2>
        <p>Sorry, we couldn't find the blog you're looking for.</p>
        <Link href="/blog" className={styles.backLink}>
          ← Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <>
      <article className={styles.article}>
        <header className={styles.articleHeader}>
          <h1 className={styles.title}>{blog.title}</h1>

          <div className={styles.metadata}>
            {blog.ncertBook && (
              <div className={styles.metaItem}>
                <strong>NCERT Book:</strong> {blog.ncertBook}
              </div>
            )}
            {blog.ncertChapter && (
              <div className={styles.metaItem}>
                <strong>Chapter:</strong> {blog.ncertChapter}
              </div>
            )}
            {blog.targetClasses && blog.targetClasses.length > 0 && (
              <div className={styles.metaItem}>
                <strong>Target Classes:</strong> {blog.targetClasses.join(", ")}
              </div>
            )}
            {blog.estimatedStudyTime && (
              <div className={styles.metaItem}>
                <strong>Study Time:</strong> {blog.estimatedStudyTime} minutes
              </div>
            )}
          </div>
        </header>

        <div
          className={styles.content}
          dangerouslySetInnerHTML={{
            __html: blog.richContent || blog.content || "",
          }}
        />
      </article>

      <footer className={styles.footer}>
        <Link href="/blog" className={styles.backLink}>
          ← Back to Blogs
        </Link>
      </footer>
    </>
  );
}
