import { useEffect, useRef } from 'react';
import './OurBlog.css';

const POSTS = [
  {
    id: 1,
    category: 'Behind the Craft',
    title: 'The Art of Dubai Chocolate',
    readTime: '5 min read',
    excerpt: 'Discover what makes Dubai chocolate unique and why our handcrafted creations are taking the world by storm.',
    image: '/blog/dubai-chocolate.jpg',
    imageFallback: 'linear-gradient(135deg, rgba(58,110,95,0.3), rgba(200,160,100,0.2))',
    tag: 'Featured',
  },
  {
    id: 2,
    category: 'Flavor Stories',
    title: 'Kunafa Meets Chocolate',
    readTime: '6 min read',
    excerpt: "The fascinating story behind our signature Kunafa Pistachio chocolate and the traditional flavors that inspired it.",
    image: '/blog/kunafa-story.jpg',
    imageFallback: 'linear-gradient(135deg, rgba(195,78,124,0.2), rgba(58,110,95,0.25))',
    tag: 'New',
  },
  {
    id: 3,
    category: "What's Next",
    title: 'Coming Soon: More Artisan Delights',
    readTime: '4 min read',
    excerpt: "Get a sneak peek at our upcoming products including brownies, pancakes, and other packed food innovations.",
    image: '/blog/coming-soon.jpg',
    imageFallback: 'linear-gradient(135deg, rgba(200,160,100,0.25), rgba(195,78,124,0.2))',
    tag: 'Coming Soon',
  },
];

export default function OurBlog() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.add('ob--visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="ob">
      {/* Background */}
      <div className="ob__bg">
        <div className="ob__bg-gradient" />
        <div className="ob__bg-grid" />
      </div>

      <div className="ob__inner">
        {/* Header */}
        <div className="ob__header">
          <div className="ob__label">
            <div className="ob__label-line" />
            <span>Stories & Updates</span>
            <div className="ob__label-line" />
          </div>
          <h2 className="ob__heading">Our Blog</h2>
          <p className="ob__subheading">
            Deep dives into flavor, craft, and the stories behind every Melizzo creation.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="ob__grid">
          {POSTS.map((post, i) => (
            <article
              key={post.id}
              className="ob__card"
              style={{ '--card-delay': `${i * 0.12}s` } as React.CSSProperties}
            >
              {/* Image */}
              <div className="ob__card-image-wrapper">
                <img
                  src={post.image}
                  alt={post.title}
                  className="ob__card-image"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.style.background = post.imageFallback;
                    }
                  }}
                />
                <div className="ob__card-image-overlay" />
                <span className="ob__card-tag">{post.tag}</span>
              </div>

              {/* Content */}
              <div className="ob__card-content">
                <div className="ob__card-meta">
                  <span className="ob__card-category">{post.category}</span>
                  <span className="ob__card-dot" />
                  <span className="ob__card-readtime">{post.readTime}</span>
                </div>

                <h3 className="ob__card-title">{post.title}</h3>
                <p className="ob__card-excerpt">{post.excerpt}</p>

                <div className="ob__card-footer">
                  <a href="#" className="ob__card-link">
                    Read More
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
