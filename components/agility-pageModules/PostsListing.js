import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getImageObj, getOptimizedImage, nextImageLoader } from "../../lib/cloudinary-tools"
import { isCompositeType } from "graphql";

const PostsListing = ({ module, customData }) => {
	// get posts
	const { posts, cloud_name } = customData;

	// set up href for internal links
	let href = "/pages/[...slug]";

	// if there are no posts, display message on frontend
	if (posts.length <= 0) {
		return (
			<div className="mt-44 px-6 flex flex-col items-center justify-center">
				<h1 className="text-3xl text-center font-bold">No posts available.</h1>
				<div className="my-10">
					<Link href={href} as="/home">
						<a className="px-4 py-3 my-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:border-primary-700 focus:shadow-outline-primary transition duration-300">
							Return Home
            </a>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="relative px-8 mb-12">
			<div className="max-w-screen-xl mx-auto">
				<div className="sm:grid sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
					{posts.map((post, index) => (
						<Link href={href} as={post.url} key={index}>
							<a>
								<div className="flex-col group mb-8 md:mb-0">
									<div className="relative h-64">

										<Image
											src={post.imageSrc}
											alt={post.imageAlt}
											className="object-cover object-center rounded-t-lg"
											layout="fill"
											loader={({ src, width, height }) => nextImageLoader({ public_id: post.cloudinaryImageID, src, width, height, cloud_name })}
										/>
									</div>
									<div className="bg-gray-100 p-8 border-2 border-t-0 rounded-b-lg">
										<div className="uppercase text-primary-500 text-xs font-bold tracking-widest leading-loose">
											{post.category}
										</div>
										<div className="border-b-2 border-primary-500 w-8"></div>
										<div className="mt-4 uppercase text-gray-600 italic font-semibold text-xs">
											{post.date}
										</div>
										<h2 className="text-secondary-500 mt-1 font-black text-2xl group-hover:text-primary-500 transition duration-300">
											{post.title}
										</h2>
									</div>
								</div>
							</a>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

// function to resole post urls
const resolvePostUrls = function (sitemap, posts) {
	let dynamicUrls = {};
	posts.forEach((post) => {
		Object.keys(sitemap).forEach((path) => {
			if (sitemap[path].contentID === post.contentID) {
				dynamicUrls[post.contentID] = path;
			}
		});
	});
	return dynamicUrls;
};

PostsListing.getCustomInitialProps = async ({
	agility,
	channelName,
	languageCode,
}) => {
	// set up api
	const api = agility;

	try {
		// get sitemap...
		let sitemap = await api.getSitemap({
			channelName: channelName,
			languageCode,
		});

		// get posts...
		let rawPosts = await api.getContentList({
			referenceName: "posts",
			languageCode,
		});

		// get categories...
		let categories = await api.getContentList({
			referenceName: "categories",
			languageCode,
		});

		// resolve dynamic urls
		const dynamicUrls = resolvePostUrls(sitemap, rawPosts);

		const cloud_name = process.env.CLOUDINARY_CLOUD_NAME

		const posts = rawPosts.map((post) => {
			// categoryID
			const categoryID = post.fields.category?.contentid;

			// find category
			const category = categories?.find((c) => c.contentID == categoryID);

			// date
			const date = post.fields.date;//new Date(post.fields.date).toLocaleDateString();

			// url
			const url = dynamicUrls[post.contentID] || "#";

			// post image src
			let imageSrc = post.fields.image?.url || null

			// post image alt
			let imageAlt = post.fields.image?.label || null;

			//************************************************************
			//NEW cloudinary image!!!
			let cloudinaryImageID = null
			if (post.fields.featuredImage) {

				//if we have a cloudinary image...
				const cldImage = getImageObj(post.fields.featuredImage)
				cloudinaryImageID = cldImage.public_id
				imageAlt = cldImage.alt
				imageSrc = getOptimizedImage({ cloud_name, public_id: cloudinaryImageID, width: 500 })
			}
			//************************************************************

			return {
				contentID: post.contentID,
				title: post.fields.title,
				date,
				url,
				category: category?.fields.title || "Uncategorized",
				imageSrc,
				imageAlt,
				cloudinaryImageID
			};
		});

		//sort newest first...
		posts.sort((a, b) => {
			return b.date.localeCompare(a.date);
		})

		return {
			cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
			posts,
		};
	} catch (error) {
		if (console) console.error(error);
	}
};

export default PostsListing;
