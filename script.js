document.addEventListener('DOMContentLoaded', () => {
    let form = document.querySelector('form');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        let activityId = document.getElementById('activityId').value;
        let activityName = document.getElementById('activityName').value;
        let activityDuration = document.getElementById('activityDuration').value;
        let activityDate = document.getElementById('activityDate').value;

        // Assuming 'activityName', 'activityDuration', 'activityDate' are required
        if (activityName && activityDuration && activityDate) {
            let newActivity = {
                id: activityId,
                name: activityName,
                duration: activityDuration,
                date: activityDate
            };

            fetch('http://localhost:3000/activities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newActivity)
            })
            .then(response => response.json())
            .then(data => {
                console.log('New activity added:', data);
                displayActivity();
                form.reset();
            })
            .catch(error => console.error('Error adding activity:', error));
        } else {
            alert('Activity ID, Name, Duration, and Date are required!');
        }
    });

   
    function displayActivity() {
        fetch('http://localhost:3000/activities')
            .then(response => response.json())
            .then(data => {
                console.log('Received data:', data);
                
                let activityList = document.getElementById('activity-list');
    
                if (!activityList) {
                    console.error('No activity-list element found.');
                    return;
                }
    
                activityList.innerHTML = '';
    
                if (!Array.isArray(data)) {
                    console.error('Data is not an array');
                    return;
                }
    
                data.forEach(activity => {
                    let activityElement = document.createElement('div');
                    activityElement.classList.add("activity-item");
                    activityElement.innerHTML = `
                        <h2>${activity.name}</h2>
                        <p>Duration: ${activity.duration}</p>
                        <p>Date: ${activity.date}</p>
                    `;
    
                    let editButton = document.createElement('button');
                    editButton.classList.add('edit-button');
                    editButton.textContent = 'Edit';
                    editButton.dataset.id = activity.id;
    
                    let deleteButton = document.createElement('button');
                    deleteButton.classList.add('delete-button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.dataset.id = activity.id;
    
                    activityElement.appendChild(editButton);
                    activityElement.appendChild(deleteButton);
    
                    activityList.appendChild(activityElement);
                });
    
                document.querySelectorAll('.edit-button').forEach(button => {
                    button.addEventListener('click', editActivity);
                });
    
                document.querySelectorAll('.delete-button').forEach(button => {
                    button.addEventListener('click', deleteActivity);
                });
            })
            .catch(error => console.error('Error fetching data:', error));
    }
    
    
    function editActivity(event) {
        let activityId = event.target.dataset.id;
        let activityElement = event.target.parentElement;
    
        let newName = prompt('Enter new activity name:');
        let newDuration = prompt('Enter new duration:');
        let newDate = prompt('Enter new date (YYYY-MM-DD):');
    
        if (newName !== null && newDuration !== null && newDate !== null) {
            fetch(`http://localhost:3000/activities/${activityId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newName,
                    duration: newDuration,
                    date: newDate,
                }),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Updated activity:', data);
                activityElement.querySelector('h2').textContent = `Name: ${data.name}`;
                activityElement.querySelector('.duration').textContent = `Duration: ${data.duration}`;
                activityElement.querySelector('.date').textContent = `Date: ${data.date}`;
            })
            .catch(error => console.error('Error updating activity:', error));
        }
    }
    
    
    
      
    
    function deleteActivity(event) {
        let activityId = event.target.dataset.id;
    
        fetch(`http://localhost:3000/activities/${activityId}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            // Remove the entire activity element from the DOM
            let activityElement = event.target.parentElement;
            activityElement.remove();
        })
        .catch(error => console.error('Error deleting activity:', error));
    }
    
    
    
    
    
});
