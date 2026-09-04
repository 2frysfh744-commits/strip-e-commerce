begin;

create table if not exists public.homepage_images (
  slot text primary key,
  image_url text not null,
  updated_at timestamptz not null default now(),
  constraint homepage_images_slot_check check (
    slot in (
      'hero',
      'gallery_one',
      'gallery_two',
      'gallery_three',
      'gallery_four',
      'gallery_five',
      'category_men',
      'category_women'
    )
  ),
  constraint homepage_images_url_length_check check (
    char_length(image_url) between 1 and 2048
  )
);

alter table public.homepage_images enable row level security;

revoke all on table public.homepage_images from anon, authenticated;
grant select, insert, update, delete on table public.homepage_images to service_role;

insert into public.homepage_images (slot, image_url)
values
  ('hero', '/Hero.jpg'),
  ('gallery_one', '/home/editorial/grey-half-zip-standing.png'),
  ('gallery_two', '/home/editorial/brown-half-zip-standing.jpg'),
  ('gallery_three', '/categories/women.jpg'),
  ('gallery_four', '/home/editorial/black-half-zip-light-denim.png'),
  ('gallery_five', '/home/editorial/grey-half-zip-seated.png'),
  ('category_men', '/products/model/black-half-zip-cargo.png'),
  ('category_women', '/categories/women.jpg')
on conflict (slot) do nothing;

commit;
