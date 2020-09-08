//get app, which is the root
const app = document.getElementById('root')
//create container, attribute is container
const container = document.createElement('div')
container.setAttribute('class', 'container')
container.setAttribute('id','eraser')
app.appendChild(container)

//type enter to search, run the getResult() without button
$(document).ready(function(){
  $("#searchbox").keyup(function(event) {
      if (event.keyCode === 13) {
          getResult();
      }
  });
});

function getResult(){
  //API part
  let request = new XMLHttpRequest();

  let movieName = (document.getElementById("searchbox").value);
  request.open("GET", "http://www.omdbapi.com/?s=" + movieName + "&apikey=c116cd15")

  request.onload = function () {
    let response = JSON.parse(this.response);

    let filterList = response.Search;
    console.log(filterList) //check

    let filteredList = filterList.filter(function(item){return item.Type == "movie";});

    console.log(response.Search.length);

    filteredList.forEach((mo,index) => {

      //console for testing
      console.log(mo.Title)
      //create cards
      const card = document.createElement('div')
      card.setAttribute('class', 'card')
      //create headline of cards
      const h2 = document.createElement('h2')
      h2.textContent = mo.Title
      //create text of cards
      const p = document.createElement('p')
      p.textContent = mo.Year

      const cardText = document.createElement('div')
      cardText.setAttribute("class", "cardText");

      const cardImg = document.createElement("IMG");
      cardImg.setAttribute("class", "cardImg");
      cardImg.setAttribute("src", mo.Poster);

      //create button of cards for nomination
      const b = document.createElement('button')
      b.setAttribute("class", "cardBtn")
      b.setAttribute('id', index)
      b.innerHTML = "Nominate";
      b.onclick = myFunction;
      //initialization, display the empty list
      if(document.getElementById("nominations").childElementCount == 0) {
        var emptyNoti = document.getElementById("emptyNoti")
        emptyNoti.setAttribute("style", "display: flex; align-items: center;");
      }

      //if the nomination button is clicked:
      function myFunction() {

        //count text
        var count = document.getElementById('count')
        var nominationCount = document.getElementById("nominations").childElementCount;
        var plus = 1
        var correction = nominationCount + plus;
        count.innerHTML = "Complete " + correction + "/5";
        console.log(correction)

        if(emptyNoti != null) {
          emptyNoti.setAttribute("style", "display: none") //bug
        }
        //disble the button if clicked to avoid repeat
        b.disabled = true
        //add the nominated card from card container to the "clone" div in html
        var cln = card.cloneNode(true);
        var del = document.getElementById("nominations").appendChild(cln);
        //when cloning the nominated card, delete the "nominate" button
        del.removeChild(del.lastChild);
        //create remove button for the card in the "clone" div.
        const b1 = document.createElement('button')
        b1.setAttribute("class", "cardBtn")
        b1.innerHTML = "Remove";
        //if click the delete button
        b1.onclick = functionDelete;

        function functionDelete(){

          //count text minus
          count.innerHTML = "Complete " + nominationCount + "/5";
          console.log(nominationCount)

          //delete the nominated card from "clone div"
          del.remove();
          //enable the nomination button in card container
          b.disabled = false
          //if there are less than five cards in nomination, remove the banner if banner exists

          if(document.getElementById("nominations").childElementCount < 5){
            document.getElementById("successNoti").setAttribute("style", "display: none;")
            document.getElementById("submitBtn").setAttribute("disabled","disabled")
          }
        }
        del.appendChild(b1)
        //if there are more than five cards in nomination list, enable a banner
        if(document.getElementById("nominations").childElementCount >= 5) {
          //if banner has been created, do not create the banner again
          document.getElementById("successNoti").setAttribute("style", "display: flex; align-items: center;")
          document.getElementById("submitBtn").removeAttribute("disabled");
        }
      }

      //card append
      container.appendChild(card)
      card.appendChild(cardImg);
      card.appendChild(cardText)
      cardText.appendChild(h2)
      cardText.appendChild(p)
      card.appendChild(b)
    })
  }

  request.send()
  //remove search result when clicking button
  let Parent = document.getElementById("eraser");
  while (Parent.firstChild) {
    Parent.removeChild(Parent.firstChild);
  }
  var result = document.getElementById('results');
  result.innerHTML = "Results for " + '"' + movieName + '"';
}
