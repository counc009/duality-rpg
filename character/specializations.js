const verbs = ["Control", "Create", "Destroy", "Perceive", "Know", "Transform"];
const nouns = ["Air", "Earth", "Fire", "Water", "Animals", "Plants", "Body", "Illusion", "Mind", "Arcana"];
const tags  = ["Human", "Superhuman", "Simple & Weak", "Complex & Powerful"];

var specializations = [];

function saveSpecializations() {
  for ([idx, spec] of specializations.entries()) {
    spec.verb  = document.getElementById("verb"   + idx).value;
    spec.noun  = document.getElementById("noun"   + idx).value;
    spec.tag   = document.getElementById("tag"    + idx).value;
    spec.bonus = document.getElementById("sbonus" + idx).value;
  }
}

function redrawSpecializations() {
  let specs = document.getElementById("specializations");

  while (specs.firstChild) {
    specs.removeChild(specs.firstChild);
  }

  for (const [idx, spec] of specializations.entries()) {
    let spec_div = document.createElement('div');
    spec_div.className = "specialization";
    spec_div.setAttribute("id", "spec" + idx);

    // Create the verb drop-down
    let verb = document.createElement('select');
    verb.setAttribute("name", "verb" + idx);
    verb.setAttribute("id", "verb" + idx);

    let verb_empty = document.createElement('option');
    verb_empty.setAttribute("disabled", "");
    if (spec.verb == "") {
      verb_empty.setAttribute("selected", "");
    }
    verb_empty.setAttribute("value", "");
    verb.appendChild(verb_empty);

    for (const v of verbs) {
      let verb_option = document.createElement('option');
      verb_option.setAttribute("value", v);
      verb_option.textContent = v;

      if (spec.verb == v) {
        verb_option.setAttribute("selected", "");
      }

      verb.appendChild(verb_option);
    }

    spec_div.append(verb);

    // Create the noun drop-down
    let noun = document.createElement('select');
    noun.setAttribute("name", "noun" + idx);
    noun.setAttribute("id", "noun" + idx);

    let noun_empty = document.createElement('option');
    noun_empty.setAttribute("disabled", "");
    if (spec.noun == "") {
      noun_empty.setAttribute("selected", "");
    }
    noun_empty.setAttribute("value", "");
    noun.appendChild(noun_empty);

    for (const n of nouns) {
      let noun_option = document.createElement('option');
      noun_option.setAttribute("value", n);
      noun_option.textContent = n;

      if (spec.noun == n) {
        noun_option.setAttribute("selected", "");
      }

      noun.appendChild(noun_option);
    }

    spec_div.append(noun);

    // Create the tag drop-down
    let tag = document.createElement('select');
    tag.setAttribute("name", "tag" + idx);
    tag.setAttribute("id", "tag" + idx);

    let tag_empty = document.createElement('option');
    tag_empty.setAttribute("disabled", "");
    if (spec.tag == "") {
      tag_empty.setAttribute("selected", "");
    }
    tag_empty.setAttribute("value", "");
    tag.appendChild(tag_empty);

    for (const t of tags) {
      let tag_option = document.createElement('option');
      tag_option.setAttribute("value", t);
      tag_option.textContent = t;

      if (spec.tag == t) {
        tag_option.setAttribute("selected", "");
      }

      tag.appendChild(tag_option);
    }

    spec_div.append(tag);

    // Create the bonus input
    let bonus = document.createElement('input');
    bonus.setAttribute("name", "sbonus" + idx);
    bonus.setAttribute("id", "sbonus" + idx);
    bonus.setAttribute("type", "number");
    bonus.className = "bonus";
    bonus.value = spec.bonus;
    spec_div.append(bonus);

    // Create the delete button
    let del = document.createElement('button');
    del.setAttribute("type", "button");
    del.setAttribute("onclick", "deleteSpecialization(" + idx + ")");
    del.textContent = "X";
    spec_div.append(del);

    specs.appendChild(spec_div);
  }
}

function addSpecialization() {
  saveSpecializations();
  specializations.push({verb: '', noun: '', tag: '', bonus: ''});
  redrawSpecializations();
}

function deleteSpecialization(n) {
  saveSpecializations();
  specializations.splice(n, 1); // delete the element
  redrawSpecializations();
}
