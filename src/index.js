document.addEventListener('DOMContentLoaded', () => {

    fetch('http://localhost:3000/ramens')
        .then(resp => resp.json())
        .then(data => displayRamens(data));
    function displayRamens(ramens) {
        for (const ramen of ramens) {
            const menu = document.querySelector('#ramen-menu');
            createEachRamenItem(ramen, menu);
            if (ramen.id === 1) {
                document.getElementById('1').click();
            }
        }
    }
    function createEachRamenItem(ramenObj, parent) {
        const div = parent;
        const img = document.createElement('img');
        img.src = ramenObj.image;
        img.id = ramenObj.id;
        div.appendChild(img);
        img.addEventListener('click', () => {
            displayRamenDetail(ramenObj);
        });
    }
    let deatiledId = null;
    document.querySelector('#update-btn').addEventListener('click', () => {
        createUpdateForm(deatiledId);
    });
    function displayRamenDetail(ramen) {
        const div = document.querySelector('#ramen-detail');
        div.querySelector('img').src = ramen.image;
        div.querySelector('img').className = (`detail-image ${ramen.id}`);
        deatiledId = ramen.id;
        div.querySelector('h2').textContent = ramen.name;
        div.querySelector('h3').textContent = ramen.restaurant;
        document.querySelector('#rating-display').textContent = ramen.rating;
        document.querySelector('#comment-display').textContent = ramen.comment;
        
    }
    const form = document.querySelector('#new-ramen');
    form.addEventListener('submit', createRamen);
    let newRamen = null;
    function createRamen(e) {
        e.preventDefault();
        const menu = document.querySelector('#ramen-menu');
        const lastRamen = menu.lastChild.id;
        newRamen = {
            'name': form.name.value,
            'restaurant': form.restaurant.value,
            'image': form.image.value,
            'rating': form.rating.value,
            'comment': form['new-comment'].value,
            'id': Number(lastRamen) + 1
            }
        fetch('http://localhost:3000/ramens', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(newRamen)
        })
            .then(resp => resp.json())
            .then(data => {
                createEachRamenItem(data, menu);
                form.reset();
            });
    }
    function createUpdateForm(deatiledId) {
        const div = document.querySelector('#update-div')
        if(Boolean(div.innerHTML)) {
        } else {
            const form = document.createElement('form');
            form.id = 'edit-ramen';
            form.innerHTML = `
                <h4>Update the Featured Ramen</h4>
                <label for="rating">Rating: </label>
                <input type="number" name="rating" id="new-rating" />
                <label for="new-comment">Comment: </label>
                <textarea name="new-comment" id="new-comment"></textarea>
                <input type="submit" value="Update" />`;
            div.appendChild(form);
            form.lastChild.addEventListener('click', (e) => {
                updateRamen(e, form, deatiledId);
            });
        }
    }
    function updateRamen(e, form, deatiledId) {
        e.preventDefault();
        form.remove();
        fetch(`http://localhost:3000/ramens/${deatiledId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                'rating': Number(form.rating.value),
                'comment': form['new-comment'].value
            })
        })
            .then(resp => resp.json())
            .then(data => {
                document.querySelector('#rating-display').textContent = `${data.rating}`;
                document.querySelector('#comment-display').textContent = data.comment;
                document.querySelector('#ramen-menu').innerHTML = '';
                fetch('http://localhost:3000/ramens')
                    .then(resp => resp.json())
                    .then(data => {
                        for (const ramen of data) {
                        const menu = document.querySelector('#ramen-menu');
                        createEachRamenItem(ramen, menu);
                        }
                    });
                form.remove();
            });
    }
    document.querySelector('#del-btn').addEventListener('click', () => {
        deleteRamen(deatiledId);
    });
    function deleteRamen(ramenId) {
        fetch(`http://localhost:3000/ramens/${ramenId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(resp => resp.json())
            .then(() => {
                fetch('http://localhost:3000/ramens')
                    .then(resp => resp.json())
                    .then(data => {
                        document.querySelector('#ramen-menu').innerHTML = '';
                        displayRamens(data)
                    });
            });
    }
});
