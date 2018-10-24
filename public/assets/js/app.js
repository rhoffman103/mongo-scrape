$(document).ready(function() {

	const checkForSaved = function() {
		$.get("/articles", function(data) {
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
				title: $("#modal-add-note-" + thisId).find(".note-title").val(),
				body: $("#modal-add-note-" + thisId).find(".note-body").val(),
				article_id: thisId
			}
		).then(function(data) {
			console.log("my note: " + data);
			// Empty the notes section
			$("#modal-add-note-" + thisId).find(".note-title").val('');
			$("#modal-add-note-" + thisId).find(".note-body").val('');
			$("#modal-add-note-" + thisId).modal("hide");
		});
	
	});

	// Delete an article from the database
	$(document).on("click", ".delete-article", function() {
		const $this = $(this)
		thisId = $this.attr("data-delete-article");
		$.post(`/delete/article/${thisId}`)
		.then(function(deletedArticle) {
			console.log($(".card").attr("data-card"));
			$(".card").attr("data-card", thisId).remove();
		})
	});

	// Delete a Note form the database
	$(document).on("click", ".delete-note", function() {
		const $this = $(this);
		const noteId = $this.attr("data-delete-note");
		const articleId = $this.attr("data-article-id");
		$.post(`/delete/note/${noteId}/${articleId}`)
		.then(function(deletedNote) {
			$this.parent().parent().attr("data-note-card", noteId).remove();
		})
	});

});