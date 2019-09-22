var container_elem = document.getElementById("container");
container_elem.onmouseup = (event) => {
    var theCSSprop = window.getComputedStyle(container_elem, ":active").getPropertyValue("opacity");
    container_elem.style.opacity = theCSSprop;
}