import { BlogPost } from '@/types/blog';
import { BlogCard } from '@/components/organisms';

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "What's in Season: Spring Produce Guide",
    excerpt:
      "Discover the freshest spring vegetables and fruits hitting our marketplace this month from local organic farms.",
    image: '/images/blog/post-1.jpg',
    category: 'SEASONAL',
    href: '#',
  },
  {
    id: 2,
    title: 'Meet the Farmers: Heritage Meat Co.',
    excerpt:
      'Learn how Heritage Meat Co. raises ethically bred Berkshire hogs and grass-fed cattle on open pastures.',
    image: '/images/blog/post-2.jpg',
    category: 'FARM STORIES',
    href: '#',
  },
  {
    id: 3,
    title: 'Raw Milk: Benefits & Safety',
    excerpt:
      'Everything you need to know about raw dairy, from nutritional benefits to safe handling practices at home.',
    image: '/images/blog/post-3.jpg',
    category: 'GUIDES',
    href: '#',
  },
];

export function BlogSection() {
  return (
    <section className='bg-tertiary container'>
      <div className='flex items-center justify-between mb-12'>
        <h2 className='heading-lg text-tertiary'>
          STAY UP TO DATE
        </h2>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-3'>
        {blogPosts.map((post, index) => (
          <BlogCard
            key={post.id}
            index={index}
            post={post}
          />
        ))}
      </div>
    </section>
  );
}
