/* eslint-disable new-parens */
/* eslint-disable eqeqeq */
/* eslint-disable no-undef */


var baseUrl = "https://agility-nextjs-cloudinary.vercel.app/"


var FriendlyURLFormField = function () {
	var self = this;

	self.Label = "Friendly URL";
	self.ReferenceName = "FriendlyURL";

	self.Render = function (options) {
		/// <summary>
		///  The Render handler for this field.  Create any elements and bindings that you might need, pull down resources.
		/// </summary>
		/// <param name="options" type="ContentManager.Global.CustomInputFieldParams">The options used to render this field.</param>
	}

	/// <field name="Template" type="String">The partial HTML template that represents your custom field. Your ViewModel will be automatically bound to this template.</field>
	self.Template =  'https://agility.github.io/CustomFields/friendly-url/html/friendly-url-template.html';

	/// <field name="DepenenciesJS"> type="Array">The Javscript dependencies that must be loaded before your ViewModel is bound. They will be loaded in the order you specify.</field>
	self.DependenciesJS = [];

	/// <field name="DepenenciesCSS" type="Array">The CSS dependencies that must be loaded before your ViewModel is bound. They will be loaded in the order you specify.</field>
	self.DependenciesCSS = [];


	/// <field name="ViewModel" type="KO ViewModel">The KO ViewModel that will be binded to your HTML template</field>
	self.ViewModel = function (options) {
		/// <summary>The KO ViewModel that will be binded to your HTML template.</summary>
		/// <param name="options" type="Object">
		///     <field name="$elem" type="jQueryElem">The .field-row jQuery Dom Element.</field>
		///     <field name="contentItem" type="ContentItem Object">The entire Content Item object including Values and their KO Observable properties of all other fields on the form.</field>
		///     <field name="fieldBinding" type="KO Observable">The value binding of thie Custom Field Type. Get and set this field's value by using this property.</field>
		///     <field name="fieldSetting" type="Object">Object representing the field's settings such as 'Hidden', 'Label', and 'Description'</field>
		///     <field name="readonly" type="boolean">Represents if this field should be readonly or not.</field>
		/// </param>

		var self = this;
		self.relatedField = "Title"; //the other field value we want to make friendly
		self.value = options.fieldBinding;
		self.contentID = options.contentItem.ContentID;
		self.attrBinding = {};

		if (options.fieldSetting.Settings.Required === "True") {
			self.attrBinding['data-parsley-required'] = true;
		}


		self.makeFriendlyString = function (s) {
			if (s) {
				var r = s.toLowerCase();
				r = r.replace(new RegExp("\\s", 'g'), "-");
				r = r.replace(new RegExp("[àáâãäå]", 'g'), "a");
				r = r.replace(new RegExp("æ", 'g'), "ae");
				r = r.replace(new RegExp("ç", 'g'), "c");
				r = r.replace(new RegExp("[èéêë]", 'g'), "e");
				r = r.replace(new RegExp("[ìíîï]", 'g'), "i");
				r = r.replace(new RegExp("ñ", 'g'), "n");
				r = r.replace(new RegExp("[òóôõö]", 'g'), "o");
				r = r.replace(new RegExp("œ", 'g'), "oe");
				r = r.replace(new RegExp("[ùúûü]", 'g'), "u");
				r = r.replace(new RegExp("[ýÿ]", 'g'), "y");

				r = r.replace(new RegExp("[^\\w\\-@-]", 'g'), "-");
				r = r.replace(new RegExp("--+", 'g'), "-");


				if (r.lastIndexOf("-") > 0 && r.lastIndexOf("-") == r.length - 1) {
					r = r.substring(0, r.length - 1);
				}
			}

			return r;
		};

		self.regenerateUrl = function () {
			ContentManager.ViewModels.Navigation.messages().show("By changing the URL you could create broken links.\nWe recommend you add in a URL redirection from the old URL to the new URL.\nAre you sure you wish to continue?", "Re-generate URL",
				ContentManager.Global.MessageType.Question, [{
					name: "OK",
					defaultAction: true,
					callback: function () {
						var friendlyStr = self.makeFriendlyString(options.contentItem.Values[self.relatedField]());
						self.value(friendlyStr);
					}
				},
				{
					name: "Cancel",
					cancelAction: true,
					callback: function () {
						//do nothing...
					}
				}]);
		}

		//subscribe to the related field changes
		options.contentItem.Values[self.relatedField].subscribe(function (newVal) {
			//auto generate if this is a new item
			if (options.contentItem.ContentID() < 0) {
				var friendlyStr = self.makeFriendlyString(newVal);
				self.value(friendlyStr);
			}

		});

	}
}

ContentManager.Global.CustomInputFormFields.push(new FriendlyURLFormField());

//
// API Item Picker
//
var MarkdownCustomField = function () {
	/// <summary>The type definition of this Agility Custom Field Type.</summary>
	var self = this;

	/// <field name="Label" type="String">The display name of the Custom Field Type</field>
	self.Label = "Markdown";

	/// <field name="ReferenceName" type="String">The internal reference name of the Custom Field Type. Must not contain any special characters.</field>
	self.ReferenceName = "Markdown";

	/// <field name="Render" type="Function">This function runs every time the field is rendered</field>
	self.Render = function (options) {
		/// <summary>
		///  The Render handler for this field.  Create any elements and bindings that you might need, pull down resources.
		///  This method will be called everytime to the field value changes.
		/// </summary>
		/// <param name="options" type="ContentManager.Global.CustomInputFieldParams">The options used to render this field.</param>



		//get our base element
		var $pnl = $(".markdown-field", options.$elem);

		if ($pnl.size() == 0) {
			/*
			Pull in the simple but awesome MD editor here:
			https://github.com/sparksuite/simplemde-markdown-editor
			*/
			var htmlContent = `
				<div class="markdown-field">
					<link rel="stylesheet" href="https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.css">
					<script src="https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js"></script>
					<textarea data-bind='value:value'></textarea>
				</div>
				`;
			//pull down the html template and load it into the element
			options.$elem.append(htmlContent)

			$pnl = $(".markdown-field", options.$elem);

			//bind our viewmodel to this
			var viewModel = function () {

				/// <summary>The KO ViewModel that will be binded to your HTML template.</summary>
				/// <param name="options" type="Object">
				///     <field name="$elem" type="jQueryElem">The .field-row jQuery Dom Element.</field>
				///     <field name="contentItem" type="ContentItem Object">The entire Content Item object including Values and their KO Observable properties of all other fields on the form.</field>
				///     <field name="fieldBinding" type="KO Observable">The value binding of thie Custom Field Type. Get and set this field's value by using this property.</field>
				///     <field name="fieldSetting" type="Object">Object representing the field's settings such as 'Hidden', 'Label', and 'Description'</field>
				///     <field name="readonly" type="boolean">Represents if this field should be readonly or not.</field>
				/// </param>
				var self = this;

				self.value = options.fieldBinding; //.extend({ throttle: 500 });

				//TODO: determine a better way to detect if the SimpleMDE object is ready
				setTimeout(function () {

					var simplemde = new SimpleMDE({ element: $("textarea", options.$elem)[0] });
					simplemde.codemirror.on("change", function () {
						self.value(simplemde.value())
					});

				}, 1000)

			}

			ko.applyBindings(viewModel, $pnl.get(0));
		}

	}
}

ContentManager.Global.CustomInputFormFields.push(new MarkdownCustomField());


var CloudinaryVideoField = function () {
	var field = this;
	field.Label = "Cloudinary Video";
	field.ReferenceName = "CloudinaryVideo";
	field.Render = function (options) {
		/// <summary>Function called whenever the form container this Custom Field Type is rendered or refreshed.</summary>
		/// <param name="options" type="Object">
		///     <field name="$elem" type="jQueryElem">The .field-row jQuery Dom Element.</field>
		///     <field name="contentItem" type="ContentItem Object">The entire Content Item object including Values and their KO Observable properties of all other fields on the form.</field>
		///     <field name="fieldBinding" type="KO Observable">The value binding of thie Custom Field Type. Get and set this field's value using this property.</field>
		///     <field name="fieldSetting" type="Object">Object representing the field's settings such as 'Hidden', 'Label', and 'Description'</field>
		///     <field name="readonly" type="boolean">Represents if this field should be readonly or not.</field>
		/// </param>

		var $pnl = $(".cloudinary-video-field", options.$elem);



		if ($pnl.size() == 0) {



			//pull down the html template and load it into the element
			$.get(baseUrl + "cloudinary/cloudinary-video.html", function (htmlContent) {


				$.get(baseUrl + "api/cloudinary-keys", function (cloudinarySettings) {

					options.$elem.append(htmlContent)

					$pnl = $(".cloudinary-video-field", options.$elem);

					$.getScript("https://media-library.cloudinary.com/global/all.js")


					//bind our viewmodel to this
					var viewModel = new function () {
						var self = this;

						//our model
						self.defaultBinding = {
							url: ko.observable(null),
							public_id: ko.observable(null),
							resource_type: ko.observable(null),
							secure_url: ko.observable(null),
							width: ko.observable(null),
							height: ko.observable(null),
							bytes: ko.observable(null),
							duration: ko.observable(null),
						}


						self.fieldBinding = ko.observable(null);

						//init a default if null
						if (options.fieldBinding() == null || options.fieldBinding() == "") {
							var copy = self.defaultBinding;
							self.fieldBinding(copy); //init defaults
						} else {
							//set observables on the existing binding properties
							var existingBinding = ko.mapping.fromJSON(options.fieldBinding());
							self.fieldBinding(existingBinding);

						}





						//whenever any sub-property in the fieldBinding changes update the main field binding in the model
						ko.computed(function () {
							return ko.mapping.toJSON(self.fieldBinding);
						}).subscribe(function () {
							var fieldBindingJSON = ko.mapping.toJSON(self.fieldBinding());
							options.fieldBinding(fieldBindingJSON);
						});


						self.formattedDuration = ko.computed(function () {
							//returns a formatted duration

							var duration = self.fieldBinding().duration();

							if (duration != null) {
								duration = duration + ' (seconds)';
							}

							return duration;
						});



						self.chooseVideo = function () {
							window.ml = cloudinary.openMediaLibrary({
								cloud_name: cloudinarySettings.cloud_name,
								api_key: cloudinarySettings.api_key,
								insert_caption: "Choose video",
								//inline_container: '.cms-container',
								multiple: false,
								max_files: 1,
								search: { expression: 'resource_type:video' }
							}, {
								insertHandler: function (data) {
									data.assets.forEach(asset => {
										self.fieldBinding().url(asset.url)
										self.fieldBinding().public_id(asset.public_id)
										self.fieldBinding().resource_type(asset.resource_type)
										self.fieldBinding().secure_url(asset.secure_url)
										self.fieldBinding().width(asset.width)
										self.fieldBinding().height(asset.height)
										self.fieldBinding().bytes(asset.bytes)
										self.fieldBinding().duration(asset.duration)

										console.log("Inserted asset:",
											JSON.stringify(asset, null, 2))
									})
								}
							}
							)
						};

						self.editVideo = function () {

							window.ml = cloudinary.openMediaLibrary({
								cloud_name: cloudinarySettings.cloud_name,
								api_key: cloudinarySettings.api_key,
								insert_caption: "Choose video",
								//inline_container: '.cms-container',
								multiple: false,
								max_files: 1,
								asset: { resource_type: "video", type: "upload", public_id: self.fieldBinding().public_id() },
								//search: { expression: 'resource_type:video' }
							}, {
								insertHandler: function (data) {
									data.assets.forEach(asset => {
										self.fieldBinding().url(asset.url)
										self.fieldBinding().public_id(asset.public_id)
										self.fieldBinding().resource_type(asset.resource_type)
										self.fieldBinding().secure_url(asset.secure_url)
										self.fieldBinding().width(asset.width)
										self.fieldBinding().height(asset.height)
										self.fieldBinding().bytes(asset.bytes)
										self.fieldBinding().duration(asset.duration)

										console.log("Inserted asset:",
											JSON.stringify(asset, null, 2))
									})
								}
							}
							)
						};

						self.frameSrc = ko.computed(function () {
							if (self.fieldBinding().public_id() == null) {
								return "about:blank";
							} else {
								return baseUrl + "cloudinary/cloudinary-player.html?id=" + self.fieldBinding().public_id()
							}
						})

						self.isVideoSet = ko.computed(function () {
							if (self.fieldBinding().public_id() != null) {
								return true;
							} else {
								return false;
							}
						});

						self.removeVideo = function () {
							//confirms if user wants to remove video, if so clear all values
							ContentManager.ViewModels.Navigation.messages().show("Do you wish to remove this Video?", "Remove Video",
								ContentManager.Global.MessageType.Question, [{
									name: "Remove",
									defaultAction: true,
									callback: function () {

										self.fieldBinding().url(null)
										self.fieldBinding().public_id(null)
										self.fieldBinding().resource_type(null)
										self.fieldBinding().secure_url(null)
										self.fieldBinding().width(null)
										self.fieldBinding().height(null)
										self.fieldBinding().bytes(null)
										self.fieldBinding().duration(null)

									}
								},
								{
									name: "Cancel",
									cancelAction: true,
									callback: function () {
										//do nothing...
									}
								}]);
						};
					}

					ko.applyBindings(viewModel, $pnl.get(0));

				});
			});
		}



	}
}

ContentManager.Global.CustomInputFormFields.push(new CloudinaryVideoField());



var CloudinaryImageField = function () {
	var field = this;
	field.Label = "Cloudinary Image";
	field.ReferenceName = "Cloudinary Image";
	field.Render = function (options) {
		/// <summary>Function called whenever the form container this Custom Field Type is rendered or refreshed.</summary>
		/// <param name="options" type="Object">
		///     <field name="$elem" type="jQueryElem">The .field-row jQuery Dom Element.</field>
		///     <field name="contentItem" type="ContentItem Object">The entire Content Item object including Values and their KO Observable properties of all other fields on the form.</field>
		///     <field name="fieldBinding" type="KO Observable">The value binding of thie Custom Field Type. Get and set this field's value using this property.</field>
		///     <field name="fieldSetting" type="Object">Object representing the field's settings such as 'Hidden', 'Label', and 'Description'</field>
		///     <field name="readonly" type="boolean">Represents if this field should be readonly or not.</field>
		/// </param>

		var $pnl = $(".cloudinary-image-field", options.$elem);

		if ($pnl.size() == 0) {

			//pull down the html template and load it into the element
			$.get(baseUrl + "cloudinary/cloudinary-image.html", function (htmlContent) {

				$.get(baseUrl + "api/cloudinary-keys", function (cloudinarySettings) {

					options.$elem.append(htmlContent)

					$pnl = $(".cloudinary-image-field", options.$elem);

					$.getScript("https://media-library.cloudinary.com/global/all.js")


					//bind our viewmodel to this
					var viewModel = new function () {
						var self = this;

						//our model
						self.defaultBinding = {
							url: ko.observable(null),
							public_id: ko.observable(null),
							resource_type: ko.observable(null),
							secure_url: ko.observable(null),
							width: ko.observable(null),
							height: ko.observable(null),
							bytes: ko.observable(null),
							duration: ko.observable(null),
							alt: ko.observable(null),
						}


						self.fieldBinding = ko.observable(null);

						//init a default if null
						if (options.fieldBinding() == null || options.fieldBinding() == "") {
							var copy = self.defaultBinding;
							self.fieldBinding(copy); //init defaults
						} else {
							//set observables on the existing binding properties
							var existingBinding = ko.mapping.fromJSON(options.fieldBinding());
							self.fieldBinding(existingBinding);

						}



						//whenever any sub-property in the fieldBinding changes update the main field binding in the model
						ko.computed(function () {
							return ko.mapping.toJSON(self.fieldBinding);
						}).subscribe(function () {
							var fieldBindingJSON = ko.mapping.toJSON(self.fieldBinding());
							options.fieldBinding(fieldBindingJSON);
						});


						self.formattedDuration = ko.computed(function () {
							//returns a formatted duration

							var duration = self.fieldBinding().duration();

							if (duration != null) {
								duration = duration + ' (seconds)';
							}

							return duration;
						});



						self.chooseImage = function () {
							window.ml = cloudinary.openMediaLibrary({
								cloud_name: cloudinarySettings.cloud_name,
								api_key: cloudinarySettings.api_key,
								insert_caption: "Choose Image",
								//inline_container: '.cms-container',
								multiple: false,
								max_files: 1,
								search: { expression: 'resource_type:image' }
							}, {
								insertHandler: function (data) {
									data.assets.forEach(asset => {

										self.fieldBinding().url(asset.url)
										self.fieldBinding().public_id(asset.public_id)
										self.fieldBinding().resource_type(asset.resource_type)
										self.fieldBinding().secure_url(asset.secure_url)
										self.fieldBinding().width(asset.width)
										self.fieldBinding().height(asset.height)
										self.fieldBinding().bytes(asset.bytes)


										console.log("Inserted asset:",
											JSON.stringify(asset, null, 2))
									})
								}
							}
							)
						};

						self.editImage = function () {

							window.ml = cloudinary.openMediaLibrary({
								cloud_name: cloudinarySettings.cloud_name,
								api_key: cloudinarySettings.api_key,
								insert_caption: "Choose image",
								//inline_container: '.cms-container',
								multiple: false,
								max_files: 1,
								asset: { resource_type: "image", type: "upload", public_id: self.fieldBinding().public_id() },

							}, {
								insertHandler: function (data) {
									data.assets.forEach(asset => {
										self.fieldBinding().url(asset.url)
										self.fieldBinding().public_id(asset.public_id)
										self.fieldBinding().resource_type(asset.resource_type)
										self.fieldBinding().secure_url(asset.secure_url)
										self.fieldBinding().width(asset.width)
										self.fieldBinding().height(asset.height)
										self.fieldBinding().bytes(asset.bytes)
										self.fieldBinding().duration(asset.duration)

										console.log("Inserted asset:",
											JSON.stringify(asset, null, 2))
									})
								}
							}
							)
						};

						self.thmSrc = ko.computed(function () {
							if (self.fieldBinding().public_id() == null) {
								return null;
							} else {

								return "https://res.cloudinary.com/" + cloudinarySettings.cloud_name + "/image/upload/c_scale,f_auto,w_500/" + self.fieldBinding().public_id() + ".jpg"

							}
						})

						self.isImageSet = ko.computed(function () {
							if (self.fieldBinding().public_id() != null) {
								return true;
							} else {
								return false;
							}
						});

						self.removeImage = function () {
							//confirms if user wants to remove image, if so clear all values
							ContentManager.ViewModels.Navigation.messages().show("Do you wish to remove this Image?", "Remove Image",
								ContentManager.Global.MessageType.Question, [{
									name: "Remove",
									defaultAction: true,
									callback: function () {

										self.fieldBinding().url(null)
										self.fieldBinding().public_id(null)
										self.fieldBinding().resource_type(null)
										self.fieldBinding().secure_url(null)
										self.fieldBinding().width(null)
										self.fieldBinding().height(null)
										self.fieldBinding().bytes(null)
										self.fieldBinding().duration(null)

									}
								},
								{
									name: "Cancel",
									cancelAction: true,
									callback: function () {
										//do nothing...
									}
								}]);
						};
					}

					ko.applyBindings(viewModel, $pnl.get(0));

				});
			});
		}



	}
}

ContentManager.Global.CustomInputFormFields.push(new CloudinaryImageField());
