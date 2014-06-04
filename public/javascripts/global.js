var userListData = [];

$(document).ready(function(){
	populateTable();
	$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
	$('#btnAddUser').on('click', addUser);
	$('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
	$('#userList table tbody').on('click', 'td a.linkupdateuser', updateUser);
});

function populateTable() {
	var tableContent = '';

	$.getJSON('/users/userlist', function(data) {
		userListData = data;
		$.each(data, function(){
			tableContent += '<tr>';
			tableContent += '<td><a href="#" class="linkshowuser" rel="' + this._id + '" title="Show details">' + this.username + '</a></td>';
			tableContent += '<td>' + this.email +'</td>';
			tableContent += '<td><a href="#" class="linkupdateuser" rel="' + this._id + '">update</a></td>';
			tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
			tableContent += '</tr>';
		});

		$('#userList table tbody').html(tableContent);
	});
};

function showUserInfo(event) {

	event.preventDefault();

	var thisUserId = $(this).attr('rel');

	$.getJSON('/users/user/' + thisUserId, function(data) {
		$('#userInfoName').text('').text(data.fullname);
		$('#userInfoAge').text('').text(data.age);
		$('#userInfoGender').text('').text(data.gender);
		$('#userInfoLocation').text('').text(data.location);
	});
};

function addUser(event) {
	event.preventDefault();

	var errorCount = 0;
	
	$('#addUser input').each(function(index, val) {
		if ($(this).val() === '') {
			errorCount++;
		};
	});

	if (errorCount === 0) {

		var newUser = {
			'username': $('#addUser fieldset input#inputUserName').val(),
			'email': $('#addUser fieldset input#inputUserEmail').val(),
			'fullname': $('#addUser fieldset input#inputUserFullname').val(),
			'age': $('#addUser fieldset input#inputUserAge').val(),
			'location': $('#addUser fieldset input#inputUserLocation').val(),
			'gender': $('#addUser fieldset input#inputUserGender').val()
		};

		$.ajax({
			type: 'POST',
			data: newUser,
			url: '/users/adduser',
			dataType: 'JSON'
		}).done(function(response) {
			if (response.msg === '') {
				$('#addUser fieldset input').val('');
				populateTable();
			} else {
				alert('Error: ' + response.msg);
			}
		});

	} else {
		alert('Please fill in all fields');
		return false;
	}
};

function deleteUser(event) {
	event.preventDefault();

	var confirmation = confirm('Are you sure you want to delete this user?');

	if (confirmation === true) {

		$.ajax({
			type: 'DELETE',
			url: '/users/deleteuser/' + $(this).attr('rel')
		}).done(function(response) {
			if (response.msg === '') {

			} else {
				alert('Error: ' + response.msg);
			}

			populateTable();
		});

	} else {
		return false;
	}
};

function updateUser(event) {
	event.preventDefault();

	// GET user by id
	var userInfo = {};
	var thisUserId = $(this).attr('rel');
	$.getJSON('/users/user/' + thisUserId, function(data) {
		if (data) {
			// Modify form add user to edit user
			$('div#addUser h2').text('Edit User');
			$('button#btnAddUser').text('Edit User');
			$('#btnAddUser').off('click', addUser).on('click', sendUpdateUser);

			// Put data inside the form
			$('#addUser fieldset input#inputUserName').val(data.username);
			$('#addUser fieldset input#inputUserEmail').val(data.email);
			$('#addUser fieldset input#inputUserFullname').val(data.fullname);
			$('#addUser fieldset input#inputUserAge').val(data.age);
			$('#addUser fieldset input#inputUserLocation').val(data.location);
			$('#addUser fieldset input#inputUserGender').val(data.gender);
		} else {
			alert('No records found');
			return false;
		}
	});

	// Internal function: PUT data to server
	function sendUpdateUser(event) {
		event.preventDefault();

		var errorCount = 0;
		
		$('#addUser input').each(function(index, val) {
			if ($(this).val() === '') {
				errorCount++;
			};
		});

		if (errorCount === 0) {

			var userDataToUpdate = {
				'username': $('#addUser fieldset input#inputUserName').val(),
				'email': $('#addUser fieldset input#inputUserEmail').val(),
				'fullname': $('#addUser fieldset input#inputUserFullname').val(),
				'age': $('#addUser fieldset input#inputUserAge').val(),
				'location': $('#addUser fieldset input#inputUserLocation').val(),
				'gender': $('#addUser fieldset input#inputUserGender').val()
			};

			$.ajax({
				type: 'PUT',
				data: userDataToUpdate,
				url: '/users/updateuser/' + thisUserId,
				dataType: 'JSON'
			}).done(function(response) {

				if (response.msg === '') {
					
					// Modify edit form back to add user
					$('#addUser fieldset input').val('');
					$('div#addUser h2').text('Add User');
					$('button#btnAddUser').text('Add User');
					$('#btnAddUser').off('click', sendUpdateUser).on('click', addUser);

					// re-populate Table
					populateTable();
					return true;
				} else {
					alert('Error: ' + response.msg);
					return false;
				}
			});

		} else {
			alert('Please fill in all fields');
			return false;
		}	


	}


};

