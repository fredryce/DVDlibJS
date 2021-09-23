$(document).ready(function() {

	loadDVD();
    addDVD();
})



function formCancelled(){
    $("#operationDVD").hide()
    $("#container").show()

}

//takes in string either create or update

function operationDVD(operation,dvdid){
	// alert(operation);
	// alert(dvdid);
	
	// if operation == 0 {
	// }
	// else{
	// }

    // $("#operationTitle").append(operation);
	$("#searchResults").toggle()
	
    $("#operationDVD").show()
}

function loadDVD(){

	clearContactTable();

	$.ajax({
	    type: 'GET',
	    url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvds',
	    success: showDVD, //reference not calling function
	    error: function() {
		    	$('#errorMessages')
		        .append($('<li>')
		        .attr({class: 'list-group-item list-group-item-danger'})
		        .text('Error calling web service. Please try again later.'));
		}
	})
}




function showDVD(DVDArray){
	
	// $("#searchResults").hide();
	var contentRows = $('#contentRows');

	 $.each(DVDArray, function(index, DVD){
				var dvdId = DVD.id
                var title = DVD.title;
                var releaseYear = DVD.releaseYear;
                var director = DVD.director;
				var rating = DVD.rating; 
                var row = '<tr>';
                    row += '<td>' + title + '</td>';
                    row += '<td>' + releaseYear + '</td>';
					row += '<td>'+ director + '</td>';
					row += '<td>'+ rating+'</td>';
                    row += '<td><button type="button" class="btn btn-info" onclick="operationDVD('+dvdId+','+1+')">Edit</button></td>';
                    row += '<td><button type="button" class="btn btn-outline-danger btn-lg">Delete</button></td>';
                    row += '</tr>';
                
                contentRows.append(row);
            })
}


function showEditForm(contactId) {
    $('#errorMessages').empty();
    
    $.ajax({
        type: 'GET',
        url: 'http://contactlist.us-east-1.elasticbeanstalk.com/contact/' + contactId,
        success: function(data, status) {
            $('#editFirstName').val(data.firstName);
            $('#editLastName').val(data.lastName);
            $('#editCompany').val(data.company);
            $('#editPhone').val(data.phone);
            $('#editEmail').val(data.email);
            $('#editContactId').val(data.contactId);
            
        },
        error: function() {
            $('#errorMessages')
            .append($('<li>')
            .attr({class: 'list-group-item list-group-item-danger'})
            .text('Error calling web service. Please try again later.')); 
        }
    })
    
    $('#contactTable').hide();
    $('#editFormDiv').show();
}



function addDVD() {
    $('#savechange').click(function (event) {
    	var haveValidationErrors = checkAndDisplayValidationErrors($('#editForm').find('input'));
    	//checking data
        if(haveValidationErrors) {
            return false;
        }

        

        $.ajax({
           type: 'POST',
           url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvd',
           data: JSON.stringify({
                title: $('#editDvdTitle').val(),
                releaseYear: $('#editYear').val(),
                director: $('#editDirector').val(),
                rating: $('.dropdown-menu').val(),
                notes: $('#editNotes').val()
           }),
           headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json'
           },
           'dataType': 'json',
           success: function() {
               $('#errorMessages').empty();
               $('#editDvdTitle').val('');
               $('#editYear').val('');
               $('#editDirector').val('');
               $('.dropdown-menu').val('');
               $('#editNotes').val('');
               loadDVD();
           },
           error: function () {
               $('#errorMessages')
                .append($('<li>')
                .attr({class: 'list-group-item list-group-item-danger'})
                .text('Error calling web service. Please try again later.')); 
           }
        })
    });


}




function clearContactTable() {
    $('#contentRows').empty();
}

function deleteContact(contactId) {
    $.ajax({
        type: 'DELETE',
        url: 'http://contactlist.us-east-1.elasticbeanstalk.com/contact/' + contactId,
        success: function() {
            loadContacts();
        }
    });
}


function updateContact() {
    $('#updateButton').click(function(event) {
    	var haveValidationErrors = checkAndDisplayValidationErrors($('#editForm').find('input'));
        
        if(haveValidationErrors) {
            return false;
        }


        $.ajax({
            type: 'PUT',
            url: 'http://contactlist.us-east-1.elasticbeanstalk.com/contact/' + $('#editContactId').val(),
            data: JSON.stringify({
                contactId: $('#editContactId').val(),
                firstName: $('#editFirstName').val(),
                lastName: $('#editLastName').val(),
                company: $('#editCompany').val(),
                phone: $('#editPhone').val(),
                email: $('#editEmail').val()
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            'dataType': 'json',
            'success': function() {
                $('#errorMessage').empty();
                hideEditForm();
                loadContacts();
            },
            'error': function() {
                $('#errorMessages')
                .append($('<li>')
                .attr({class: 'list-group-item list-group-item-danger'})
                .text('Error calling web service. Please try again later.')); 
            }
        })
    })

}


function checkAndDisplayValidationErrors(input) {
    $('#errorMessages').empty();
    
    var errorMessages = [];
    
    input.each(function() { //this represent each object in each
        if (!this.validity.valid) {
            var errorField = $('label[for=' + this.id + ']').text();
            errorMessages.push(errorField + ' ' + this.validationMessage);
        }  
    });
    
    if (errorMessages.length > 0){
        $.each(errorMessages,function(index,message) {
            $('#errorMessages').append($('<li>').attr({class: 'list-group-item list-group-item-danger'}).text(message));
        });
        // return true, indicating that there were errors
        return true;
    } else {
        // return false, indicating that there were no errors
        return false;
    }
}
