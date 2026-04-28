-- PressHub initial schema.
-- Run this against your Supabase project (psql or SQL editor).

create extension if not exists "uuid-ossp";

-- Articles --------------------------------------------------------------
create table if not exists public.articles (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  source      text not null,
  body        text not null,
  excerpt     text,
  category    text not null check (category in ('politics','culture','education','health','tech')),
  author      text,
  location    text,
  image_url   text,
  created_at  timestamptz not null default now()
);

create index if not exists articles_created_at_idx on public.articles (created_at desc);
create index if not exists articles_category_idx on public.articles (category);

-- Comments --------------------------------------------------------------
create table if not exists public.comments (
  id          uuid primary key default uuid_generate_v4(),
  article_id  uuid not null references public.articles(id) on delete cascade,
  user_id     text not null,
  user_name   text not null,
  user_avatar text,
  body        text not null,
  parent_id   uuid references public.comments(id) on delete cascade,
  created_at  timestamptz not null default now()
);

create index if not exists comments_article_id_idx on public.comments (article_id, created_at);
create index if not exists comments_parent_id_idx on public.comments (parent_id);

-- Likes ------------------------------------------------------------------
create table if not exists public.likes (
  id          uuid primary key default uuid_generate_v4(),
  comment_id  uuid not null references public.comments(id) on delete cascade,
  user_id     text not null,
  created_at  timestamptz not null default now(),
  unique (comment_id, user_id)
);

create index if not exists likes_comment_id_idx on public.likes (comment_id);

-- Views ------------------------------------------------------------------
create table if not exists public.views (
  id          uuid primary key default uuid_generate_v4(),
  article_id  uuid not null references public.articles(id) on delete cascade,
  viewer_hash text not null,
  created_at  timestamptz not null default now(),
  unique (article_id, viewer_hash)
);

create index if not exists views_article_id_idx on public.views (article_id);

-- Row Level Security -----------------------------------------------------
alter table public.articles enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;
alter table public.views enable row level security;

drop policy if exists "articles read" on public.articles;
create policy "articles read" on public.articles for select using (true);

drop policy if exists "comments read" on public.comments;
create policy "comments read" on public.comments for select using (true);

drop policy if exists "likes read" on public.likes;
create policy "likes read" on public.likes for select using (true);

drop policy if exists "views read" on public.views;
create policy "views read" on public.views for select using (true);

drop policy if exists "comments write" on public.comments;
create policy "comments write" on public.comments for insert with check (true);

drop policy if exists "likes write" on public.likes;
create policy "likes write" on public.likes for insert with check (true);

drop policy if exists "likes delete" on public.likes;
create policy "likes delete" on public.likes for delete using (true);

drop policy if exists "views write" on public.views;
create policy "views write" on public.views for insert with check (true);

-- Seed data --------------------------------------------------------------
insert into public.articles (id, title, source, author, location, category, excerpt, body)
values
  (
    '00000000-0000-0000-0000-000000000001',
    'Alderman Reyes Pushes Affordable Housing Set-Aside for Pilsen Developments',
    'Chicago Defender',
    'Janelle Brooks',
    'Chicago, IL',
    'politics',
    'A new ordinance from Alderman Maritza Reyes would require any market-rate development of 20 units or more in the 25th Ward to set aside one-third of its homes for families earning under 60% of area median income.',
    'A new ordinance moving through City Council could reshape the way new housing gets built across Pilsen, Little Village and the western edge of the South Loop. Alderman Maritza Reyes (25th) introduced the proposal Tuesday night, joined by community organizers from the Pilsen Alliance and members of two parish councils.

"The market is not coming to save my neighbors," Reyes told a crowded chamber. "We are going to write the rule that the market has to follow."

Under the proposal, any market-rate development of 20 units or more in the 25th Ward would set aside one-third of its homes for families earning under 60% of area median income. That is a significantly higher set-aside than the citywide Affordable Requirements Ordinance, which currently caps mandated affordable units at 20 percent in most wards.

Developers pushed back almost immediately. The Home Builders Association of Greater Chicago called the threshold "economically unworkable" without additional tax incentives, and warned that projects would simply move to neighboring wards.

But longtime residents at the hearing said the displacement they have already lived through is the more pressing math problem. "I have watched four families on my block leave in two years," said Pilsen homeowner Esperanza Vela. "If we do not act now, there will be nobody left to argue about the rent."

The ordinance heads to the Housing Committee next month. Reyes says she has commitments from six colleagues, but will need at least three more to bring it to the floor.'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'Pennsylvania Avenue Jazz Returns: Baltimore''s Festival Roars Back After a Decade',
    'The Afro-American',
    'Marcus Whitfield',
    'Baltimore, MD',
    'culture',
    'After a ten-year hiatus, the Pennsylvania Avenue Jazz Festival returns this June with a three-block outdoor stage, an oral history tent, and headliners drawn from the city''s own conservatories.',
    'For ten summers, the corner of Pennsylvania Avenue and Lafayette stayed quiet on the third weekend of June. This year, the horns come back.

Organizers from the Pennsylvania Avenue Black Arts and Entertainment District announced Wednesday that the Pennsylvania Avenue Jazz Festival will return June 19-21, 2026, after a decade of fundraising setbacks, pandemic delays, and what longtime trustee Della Greene called "the slow work of getting the neighborhood to believe in itself again."

The festival once drew Cab Calloway and Billie Holiday in its golden age. Greene says the new edition will not try to recreate that lineup, but it will honor it. A three-block outdoor stage will run from Dolphin to Laurens Street, with an oral history tent where residents can record their memories of the Royal Theater and the Avenue''s club circuit.

Headliners are drawn largely from local conservatories: the Peabody Jazz Orchestra, vocalist Tyrese Hodge, and a reunion set from the Whitefield Brothers, who have not played the city together since 2014.

"This is not nostalgia, this is repair," said Mayor Brandon Scott at the announcement. The city is contributing $400,000 from its arts and culture fund, with a matching grant from the France-Merrick Foundation.

Residents on the surrounding blocks were cautious but warm. "Just keep the noise reasonable past ten," joked Marvin Joyner, who has lived on McCulloh Street for thirty-eight years. "And bring back the food trucks. Especially the crab pretzels."'
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'DC Charter Renewal Hearings Expose Deep Split Over Ward 7 Expansion',
    'The Washington Informer',
    'Kendra Boateng',
    'Washington, DC',
    'education',
    'A proposal to expand a high-performing charter network into two new Ward 7 buildings has divided parents, teachers'' union leaders, and ANC commissioners over the future of neighborhood schools.',
    'A standing-room-only hearing at the DC Public Charter School Board ran past 11 p.m. on Monday as parents, teachers, and elected commissioners argued over a proposal to expand the Capital Compass Charter network into two new Ward 7 buildings.

Capital Compass currently operates four campuses in Wards 5, 7, and 8 and posts some of the highest math scores in the city. Its application would add a 6-12 building on Minnesota Avenue and a K-5 campus on Benning Road, drawing roughly 1,400 additional seats.

Supporters, many of them Compass parents, described the schools in personal terms. "My son was reading two grades below level. Now he is on the debate team," said Ward 7 mother Tasha Greene. "Do not take that option from another kid."

Opponents focused on what the expansion would mean for traditional DCPS schools nearby, where enrollment has fallen for four consecutive years. Washington Teachers'' Union president Jacqueline Pogue Lyons told the board that two neighborhood middle schools could lose enough enrollment to trigger consolidation reviews. "We are not against choice," she said. "We are against starving the schools that take every child who walks through the door."

ANC 7B commissioner Andre Wallace urged the board to delay a vote until the city completes its long-promised facilities equity study. The board is expected to rule by mid-May.

Whatever the outcome, the hearing made clear that Ward 7 families do not feel they have been given a real plan for either system.'
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    'Atlanta''s Mobile Vaccine Van Logs 10,000th Visit on West Lake Route',
    'The Atlanta Voice',
    'Dr. Renee Holloway',
    'Atlanta, GA',
    'health',
    'Westside Community Clinic''s mobile vaccination program reached a milestone Saturday in West Lake, where it has reduced the neighborhood''s pediatric immunization gap by more than half since 2023.',
    'Westside Community Clinic''s mobile vaccination program rolled into the West Lake MARTA parking lot Saturday morning and quietly logged its 10,000th patient visit since the van was donated by Grady Health in 2023.

The patient was 4-year-old Amari Fields, in for a booster shot. His mother Tia Fields said the van is the only reason her three children are caught up. "I work two jobs," she said. "When the clinic comes to my bus stop, I do not have to choose between the shot and the shift."

Westside''s program targets the four ZIP codes in southwest Atlanta with the lowest pediatric immunization rates in Fulton County. Clinic director Dr. Aisha Walters said the gap between those neighborhoods and the county average has narrowed from 18 percentage points in 2023 to about 7 today.

The van is staffed by two rotating nurse practitioners, a community health worker, and a pharmacy student from Mercer. Vaccinations are free regardless of insurance status. "We do not check papers, we check arms," Walters said.

Funding remains tight. A federal Health Resources and Services Administration grant that covers about 40 percent of the program''s annual budget is up for reauthorization this fall, and clinic officials said they are watching the appropriations debate in Washington with concern.

For now, the van keeps its weekly route: West Lake on Saturdays, Bankhead on Tuesdays, Pittsburgh on Thursdays, and a roving stop wherever a school nurse or church calls.'
  ),
  (
    '00000000-0000-0000-0000-000000000005',
    'Detroit Senior Centers Train Elders to Spot AI-Generated Misinformation',
    'The Michigan Chronicle',
    'Damon Pierce',
    'Detroit, MI',
    'tech',
    'A new digital literacy program at three Detroit senior centers is teaching residents over 60 how to identify AI-generated images, deepfake voicemails, and synthetic political ads ahead of the 2026 elections.',
    'The lights in the computer lab at the Northwest Activities Center dimmed Wednesday afternoon as instructor Camille Tate played two short audio clips for a room of fifteen seniors. One was a real radio ad. The other was a deepfake of the same voice asking listeners to "verify their voter registration" at a fake URL.

A handful of hands went up for the wrong clip. "And that is exactly why we are doing this," Tate said.

The class is part of a new digital literacy program from the Detroit Area Agency on Aging, in partnership with Wayne State''s School of Information Sciences. It is running across three senior centers this spring, with plans to expand to all eight by fall.

Participants learn to look for telltale signs of AI-generated images, deepfake voicemails impersonating grandchildren, and synthetic political ads. The curriculum covers reverse image search, how to verify a caller through a callback number, and how to read a URL.

"I thought I was sharp," said 71-year-old participant Loretta Blair. "But that voicemail one had me. It sounded just like my nephew."

Organizers say they are racing the calendar. The 2026 election season is bringing a wave of synthetic political content, and seniors remain the demographic most likely to share misinformation, according to a 2023 NYU study.

Tate keeps the message simple. "Pause before you click. Pause before you forward. If your gut says something is off, your gut is probably right."'
  )
on conflict (id) do nothing;
