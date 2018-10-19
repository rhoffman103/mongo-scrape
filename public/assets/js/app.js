$(document).ready(function() {

	const checkForSaved = function() {
		$.get("/articles", function(data) {
			console.log(data[0]._id)
			const titles = data.map(title => title.title);
			titles.forEach(function(savedTitle) {
				$(".card-title").each(function(index) {
					var $scrapedTitle = $(this);
					if(savedTitle.indexOf($scrapedTitle.text()) > -1){
						$scrapedTitle.siblings(".save-article")
							.removeClass("save-article options")
							.text("Saved");
					}
				});
			});
		});
	};

	const saveArticle = (article) => {
		$.post("/save/article", article);
		console.log("saved article: " + article.title);
	}

	checkForSaved();

	// EVENTS
	// Prepare to save a scraped article
	$(document).on("click", ".save-article", function() {
		var $this = $(this);
		var article = {
			title: $this.siblings(".card-title").text(),
			link: $this.siblings(".card-title").children("a").attr('href'),
			summary: $this.siblings(".card-text").text(),
		}
		saveArticle(article);
		$this.removeClass("save-article")
			.attr({class: "saved-article"})
			.text("Saved For Later");
	});

	// Save a note for a specific article
	$(document).on("click", ".save-note", function() {
		// Grab the id associated with the article from the submit button
		var thisId = $(this).attr("data-id");

		// Run a POST request to change the note, using what's entered in the inputs
		$.post(`/articles/${thisId}`,
			{
				// Value taken from title input
				title: $("#note-title").val(),
				// Value taken from note textarea
				body: $("#note-body").val()
			})
			// With that done
			.then(function(data) {
				// Log the response
				console.log(data);
				// Empty the notes section
				$("#note-title").val("");
				$("#note-body").val("");
				// $(".add-note-modal").modal("dispose");
			});
	});

});