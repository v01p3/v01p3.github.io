$(document).ready(function() {
	$.get('posts/posts.json', function(data) {
		$.each(data, function(index, post) {
			$.get('posts/' + post.url, function(content) {
				var html = marked(content.split('\n')[0]);
				$('#posts').append(
					'<div class="post">' +
					'<h2>' + post.title + '</h2>' +
					'<div class="date">' + post.date + '</div>' +
					'<div class="content">' + html + '</div>' +
					'<a href="posts/' + post.url + '">Read More</a>' +
					'</div>'
				);
			});
		});
	});
});