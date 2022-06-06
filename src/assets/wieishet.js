function yasgui (endpoint) {
  var yasguiContainer = document.getElementById('yasgui');
  if (yasguiContainer) {
    
    const yasgui = new Yasgui(document.getElementById("yasgui"), {
      requestConfig: { 
        endpoint: endpoint
      },
      copyEndpointOnNewTab: false,
      persistencyExpire: 0,
    });
    const tab = yasgui.getTab();
    tab.setQuery(`PREFIX : <https://wieishet.nu/ontologie#>
PREFIX schema: <https://schema.org/> 
SELECT * WHERE 
{
  ## hieronder kun je je zoekopdracht invoeren ##
  ## bv. ?persoon :Geslacht :Vrouw .##
  ?persoon a :Persoon .

  ### hieronder niets aanpassen ###
  ?persoon schema:givenName ?voornaam ; schema:image ?afbeelding .
} ORDER BY ?voornaam `);
    tab.yasr.selectPlugin("Kaarten")
    tab.yasqe.collapsePrefixes(true);
    console.log(tab.yasqe)
  }
}


class Kaarten {
  // A priority value. If multiple plugin support rendering of a result, this value is used
  // to select the correct plugin
  priority = 10;

  // Whether to show a select-button for this plugin
  hideFromSelection = true;

  constructor(yasr) {
    this.yasr = yasr;
  }

  draw() {
    const el = document.createElement("div");
    el.classList.add('kaarten')
    if (this.yasr.results.json.results.bindings.length == 0) {
      el.innerHTML = `
      <h1>Oops &hellip;</h1>
      <p>Je zoekopdracht leverde geen personen op.<br>Pas je Sparql Query  aan en probeer het opnieuw.</p>
      `
    } else {
      this.yasr.results.json.results.bindings.forEach(kaart => {
        const h1 = document.createElement('h1')
        h1.onclick = function () {
          window.location = `/personen/${kaart.voornaam.value}`
        }
        h1.classList.add('kaart')
        const img = new Image()
        img.src = kaart.afbeelding.value
        h1.appendChild(img)
        const p = document.createElement('p')
        p.textContent = kaart.voornaam.value;
        h1.appendChild(p)
        el.appendChild(h1)
      });
    }
    this.yasr.resultsEl.appendChild(el);
  }

  // A required function, used to indicate whether this plugin can draw the current
  // resultset from yasr
  canHandleResults() {
    const vars = this.yasr.results.json.head.vars
    return vars.includes('persoon') 
      && vars.includes('voornaam') 
      && vars.includes('afbeelding') 
  }
  // A required function, used to identify the plugin, works best with an svg
  getIcon() {
    const textIcon = document.createElement("p");
    textIcon.innerText = "✓/✗";
    return textIcon;
  }
}

//Register the plugin to Yasr
Yasr.registerPlugin("Kaarten", Kaarten);
