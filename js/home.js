$(document).ready(function() {

	loadDVD();
    //addDVD();
    //updateDVD();
})



function hideEditForm(){
    $("#operationDVD").toggle();
    $('#searchResults').toggle();

}
//takes in string either create or update

function operationDVD(dvdId, operation,dvdTitle){

    if(operation==1){
        //when operation is edit
        updateDVD();
        $('#errorMessages').empty();
        $.ajax({
            type: 'GET',
            url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvd/' + dvdId,
            success: function(data, status) {
                $('#editDvdTitle').val(data.title);
                $('#editYear').val(data.releaseYear);
                $('#editDirector').val(data.director);
                //$('.dropdown-menu').val(data.rating);
                $('#editNotes').val(data.notes);
                $('#editDVDId').val(dvdId);
                
            },
            error: function() {
                $('#errorMessages')
                .append($('<li>')
                .attr({class: 'list-group-item list-group-item-danger'})
                .text('Error calling web service. Please try again later.')); 
            }
        })
        
    }
    else{
        addDVD();
    }

    $("#operationTitle").text(dvdTitle)
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

                var heading = "Edit: " + title

                var row = '<tr>';
                    row += '<td>' + title + '</td>';
                    row += '<td>' + releaseYear + '</td>';
					row += '<td>'+ director + '</td>';
					row += '<td>'+ rating+'</td>';
                    row += "<td><button type='button' class='btn btn-info' onclick='operationDVD("+ dvdId + "," + 1 + ",\"" + heading + "\");'>Edit</button></td>";
                    row += "<td><button type='button' class='btn btn-outline-danger btn-lg' onClick='deleteDVD(" + dvdId + ")'>Delete</button></td>";
                    row += '</tr>';
                
                contentRows.append(row);
            })
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
               //$('.dropdown-menu').val('');
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

function deleteDVD(contactId) {
    $.ajax({
        type: 'DELETE',
        url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvd/' + contactId,
        success: function() {
            loadDVD();
        }
    });
}


function updateDVD() {
    $('#savechange').click(function(event) {
        alert("im updating....");
        alert($('#editDVDId').val());
    	var haveValidationErrors = checkAndDisplayValidationErrors($('#editForm').find('input'));
        
        if(haveValidationErrors) {
            return false;
        }


        $.ajax({
            type: 'PUT',
            url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvd/' + $('#editDVDId').val(),
            data: JSON.stringify({
                dvdId: $('#editDVDId').val(),
                title: $('#editDvdTitle').val(),
                releaseYear: $('#editYear').val(),
                director: $('#editDirector').val(),
                //rating: $('.dropdown-menu').val(),
                notes: $('#editNotes').val()
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
