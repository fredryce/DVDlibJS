$(document).ready(function() {

	loadContacts();
	addContact();
	updateContact();
})




function loadContacts(){

	clearContactTable();

	$.ajax({
	    type: 'GET',
	    url: 'http://contactlist.us-east-1.elasticbeanstalk.com/contacts',
	    success: showContact, //reference not calling function
	    error: function() {
		    	$('#errorMessages')
		        .append($('<li>')
		        .attr({class: 'list-group-item list-group-item-danger'})
		        .text('Error calling web service. Please try again later.'));
		}
	})
}


function hideEditForm(){
	$("#editFormDiv").toggle();
	$('#contactTable').toggle();

}

function showContact(contactArray){

	var contentRows = $('#contentRows');

	 $.each(contactArray, function(index, contact){
                var name = contact.firstName + ' ' + contact.lastName;
                var company = contact.company;
                var contactId = contact.contactId;
                
                var row = '<tr>';
                    row += '<td>' + name + '</td>';
                    row += '<td>' + company + '</td>';
                    row += '<td><button type="button" onClick="showEditForm(' + contactId + ')" class="btn btn-outline-info btn-lg">Edit</button></td>'
                    row += '<td><button type="button" onClick="deleteContact(' + contactId + ')" class="btn btn-outline-danger btn-lg">Delete</button></td>';
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



function addContact() {
    $('#addButton').click(function (event) {
    	var haveValidationErrors = checkAndDisplayValidationErrors($('#addForm').find('input'));
    	//checking data
        if(haveValidationErrors) {
            return false;
        }


        $.ajax({
           type: 'POST',
           url: 'http://contactlist.us-east-1.elasticbeanstalk.com/contact',
           data: JSON.stringify({
                firstName: $('#addFirstName').val(),
                lastName: $('#addLastName').val(),
                company: $('#addCompany').val(),
                phone: $('#addPhone').val(),
                email: $('#addEmail').val()
           }),
           headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json'
           },
           'dataType': 'json',
           success: function() {
               $('#errorMessages').empty();
               $('#addFirstName').val('');
               $('#addLastName').val('');
               $('#addCompany').val('');
               $('#addphone').val('');
               $('#addEmail').val('');
               loadContacts();
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