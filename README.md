# Agility CMS + Cloudinary & Next.js Starter

This is sample Next.js starter site that uses Agility CMS and Cloudinary together and aims to be a foundation for building fully static sites using Next.js, Agility CMS and Cloudinary.

[Live Website Demo](https://agilitycms-nextjs-starter-blog.vercel.app/)

[New to Agility CMS? Sign up for a FREE account](https://agilitycms.com/free)

## 🌥🌥🌥Cloudinary🌥🌥🌥

- Cloudinary is an amazing tool to help you unleash the full potential of your online media.
- Optimize, transform, and combine your images to create great digital experiences
- Upload and stream high quality adaptive videos from your website
- [Sign up for a free Cloudinary account here](https://cloudinary.com/invites/lpov9zyyucivvxsnalc5/udfxmpuf8euczsps2fnx)


## About This Starter

- Uses our [`@agility/next`](https://github.com/agility/agility-next) package to make getting started with Agility CMS and Next.js easy
- Connected to a sample Agility CMS Instance for sample content & pages
- Uses **Cloudinary** for Cloudinary Images and videos (_*** additional setup required - see below! ***_)
- Uses the `getStaticProps` function from Next.js to allow for full SSG (Static Site Generation)
- Supports [`next/image`](https://nextjs.org/docs/api-reference/next/image) for image optimization
- Supports full [Page Management](https://help.agilitycms.com/hc/en-us/articles/360055805831)
- Supports Preview Mode
- Uses `revalidate` tag with Vercel to enable [ISR (Incremental Static Regeneration)](https://nextjs.org/docs/basic-features/data-fetching#incremental-static-regeneration) builds
- Provides a functional structure that dynamically routes each page based on the request, loads a Page Templates dynamically, and also dynamically loads and renders appropriate Agility CMS Page Modules (as React components)


### Tailwind CSS

This starter uses [Tailwind CSS](https://tailwindcss.com/), a simple and lightweight utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup.

It also comes equipped with [Autoprefixer](https://www.npmjs.com/package/autoprefixer), a plugin which use the data based on current browser popularity and property support to apply CSS prefixes for you.


## Getting Started

To start using this Starter, [sign up](https://agilitycms.com/free) for a FREE account and create a new Instance using the Blog Template.

1. Clone this repository
2. Run `npm install` or `yarn install`
3. Rename the `.env.local.example` file to `.env.local`
4. Retrieve your `GUID`, `API Keys (Preview/Fetch)`, and `Security Key` from Agility CMS by going to [Settings > API Keys](https://manager.agilitycms.com/settings/apikeys).
	- [How to Retrieve your GUID and API Keys from Agility](https://help.agilitycms.com/hc/en-us/articles/360031919212-Retrieving-your-API-Key-s-Guid-and-API-URL-)

## Additional Steps to Integrate with Cloudinary

This starter builds on top of the Blog Starter Content Model, and has a special integration hosted in this repo.  You'll need to deploy it to Vercel to get that working.

1. [Create your Cloudinary Account](https://cloudinary.com/invites/lpov9zyyucivvxsnalc5/udfxmpuf8euczsps2fnx) and get your Credentials
	- Ensure your .env.local has `CLOUDINARY_CLOUD_NAME` and `CLOUDINARY_API_KEY` from your Cloudinary dashboard.

2. Deploy to Vercel
	- Push your clone of this repo into a new repo in Github
	- Login to [Vercel](https://vercel.com) and create a new project from your new repo
	- Create environment variables for the values in your `.env.local` file
	- When the site deploys, take note of the URL `https://[yourproject].vercel.app`
3. Add the Cloudinary UI Extension to Agility
	- Login to your blog instance in Agility and navigate to **Settings -> UI Extensions**
	- Replace the path there with YOUR URL + custom-fields.js:
		- `https://[yourproject].vercel.app/custom-field.js`
	- Save.
	- Refresh your Browser window
4. Add Cloudinary fields to the **Post** Content Model in Agility
	- We're going to add 2 new fields to this model and change one of the existing fields to not be required.
	- Navigate to **Models -> Content Models -> Post**
	- Click **Edit** on the Blog Cloudinary Image field
		- Uncheck Required Field
		- Click the *Update Field* button
	- Click **Add Field**
		- Field Name: `Cloudinary Image`
		- Field Type: `Custom Field`
		- Custom Field Type: `Cloudinary Image`
		- Click the *Add Field* button
	- Click **Add Field**
		- Field Name: `Cloudinary Video`
		- Field Type: `Custom Field`
		- Custom Field Type: `Cloudinary Video`
		- Click the *Add Field* button
	- Click **Save**
5. Create a new Post with a Cloudinary Image and/or Video
	- Navigate to **Content -> Blog Posts**
	- Click **+ New**
	- Fill out the fields, but DON'T choose a `Blog Cloudinary Image`
	- On the `Cloudinary Image` field click **Choose**
		- You should see your Cloudinary Media library.  You can upload or choose an existing image.
	- On the `Cloudinary Video` field, click  **Choose**
		- You can upload or choose an existing video.

## Running the Site Locally

### Development Mode

When running your site in `development` mode, you will see the latest content in real-time from the CMS.

#### yarn

1. `yarn install`
2. `yarn dev`

To update content locally without restarting your dev server, run `yarn cms-pull`

To clear your content cache locally, run `yarn cms-clear`

#### npm

1. `npm install`
2. `npm run dev`

To update content locally without restarting your dev server, run `npm run cms-pull`

To clear your content cache locally, run `npm run cms-clear`

### Production Mode

When running your site in `production` mode, you will see the published from the CMS.

#### yarn

1. `yarn build`
2. `yarn start`

#### npm

1. `npm run build`
2. `npm run start`

## Special Cloudinary Stuff 🌥🌥🌥

- Check out the `Video` component in `components/common/Video.js`.  It uses Cloudinary's `AdvancedVideo` component to automagically display a video based on the public id.
- Check out the `lib/cloudinary-tools.js` file - it has a bunch of methods for manipulating Cloudinary images.
- I bet you can make a ton of improvements on this - if you do, let me know (@joelvarty)
## Notes

### TypeScript

This starter supports [TypeScript](https://nextjs.org/docs/basic-features/typescript) out of the box. If you would like to use TypeScript in your project, simply rename your files with a `.ts` extension to start taking advantage of Typescript concepts such as types and interfaces to help describe your data.


### How to Register Page Modules

1. To create a new Page Module, create a new React component within the `/components/agility-pageModules` directory.
2. All of the Page Modules that are being used within the site need to be imported into the `index` file within the `/components/agility-pageModules` directory and added to the `allModules` array:

```
import RichTextArea from "./RichTextArea";
import FeaturedPost from "./FeaturedPost";
import PostsListing from "./PostsListing";
import PostDetails from "./PostDetails";
import Heading from "./Heading";
import TextBlockWithImage from "./TextBlockWithImage";

const allModules = [
  { name: "TextBlockWithImage", module: TextBlockWithImage },
  { name: "Heading", module: Heading },
  { name: "FeaturedPost", module: FeaturedPost },
  { name: "PostsListing", module: PostsListing },
  { name: "PostDetails", module: PostDetails },
  { name: "RichTextArea", module: RichTextArea },
];
```

### How to Register Page Templates

1. To create a new Page Template, create a new React component within the `/components/agility-pageTemplates` directory.
2. All of the Page Template that are being used within the site need to be imported into the `index` file within the `/components/agility-pageTemplates` directory and added to the `allTemplates` array:

```
import MainTemplate from "./MainTemplate";

const allTemplates = [
  { name: "MainTemplate", template: MainTemplate }
];
```

### How to Preview Content

Since this is a static site, how can editors preview content in real-time as they are making edits within Agility CMS? Vercel supports Previews out of the box! Simply paste the address of your site deployed on Vercel into your Agility Sitemap Configuration (Settings > Sitemaps), and use it as your Preview Deployment.

## Resources

### Agility CMS
- [Official site](https://agilitycms.com)
- [Documentation](https://help.agilitycms.com/hc/en-us)

### Cloudinary
- [Official site](https://cloudinary.com)
- [Documentation](https://cloudinary.com/documentation)

### Next.js
- [Official site](https://nextjs.org/)
- [Documentation](https://nextjs.org/docs/getting-started)

### Vercel
- [Official site](https://vercel.com/)

### Tailwind CSS
- [Official site](http://tailwindcss.com/)
- [Documentation](http://tailwindcss.com/docs)

### Community
- [Official Slack](https://join.slack.com/t/agilitycommunity/shared_invite/enQtNzI2NDc3MzU4Njc2LWI2OTNjZTI3ZGY1NWRiNTYzNmEyNmI0MGZlZTRkYzI3NmRjNzkxYmI5YTZjNTg2ZTk4NGUzNjg5NzY3OWViZGI)
- [Blog](https://agilitycms.com/resources/posts)
- [GitHub](https://github.com/agility)
- [Forums](https://help.agilitycms.com/hc/en-us/community/topics)
- [Facebook](https://www.facebook.com/AgilityCMS/)
- [Twitter](https://twitter.com/AgilityCMS)

## Feedback and Questions
If you have feedback or questions about this starter, please use the [Github Issues](https://github.com/agility/agilitycms-nextjs-starter/issues) on this repo, join our [Community Slack Channel](https://join.slack.com/t/agilitycommunity/shared_invite/enQtNzI2NDc3MzU4Njc2LWI2OTNjZTI3ZGY1NWRiNTYzNmEyNmI0MGZlZTRkYzI3NmRjNzkxYmI5YTZjNTg2ZTk4NGUzNjg5NzY3OWViZGI) or create a post on the [Agility Developer Community](https://help.agilitycms.com/hc/en-us/community/topics).
