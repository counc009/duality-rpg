var experiences = [];

function saveExperiences() {
  for ([idx, spec] of experiences.entries()) {
    spec.bonus = document.getElementById("ebonus" + idx).value;
    spec.desc  = document.getElementById("edesc"  + idx).value;
  }
}

function redrawExperiences() {
  let exps = document.getElementById("experiences");

  while (exps.firstChild) {
    exps.removeChild(exps.firstChild);
  }

  for (const [idx, exp] of experiences.entries()) {
    let exp_div = document.createElement('div');
    exp_div.className = "experience";
    exp_div.setAttribute("id", "exp" + idx);

    // Create the bonus input
    let bonus = document.createElement('input');
    bonus.setAttribute("name", "ebonus" + idx);
    bonus.setAttribute("id", "ebonus" + idx);
    bonus.setAttribute("type", "number");
    bonus.className = "bonus";
    bonus.value = exp.bonus;
    exp_div.append(bonus);

    // Create the description input
    let desc = document.createElement('input');
    desc.setAttribute("name", "edesc" + idx);
    desc.setAttribute("id", "edesc" + idx);
    desc.setAttribute("type", "string");
    desc.className = "desc";
    desc.value = exp.desc;
    exp_div.append(desc);

    // Create the delete button
    let del = document.createElement('button');
    del.setAttribute("type", "button");
    del.setAttribute("onclick", "deleteExperience(" + idx + ")");
    del.textContent = "X";
    exp_div.append(del);

    exps.appendChild(exp_div);
  }
}

function addExperience() {
  saveExperiences();
  experiences.push({bonus: '', desc: ''});
  redrawExperiences();
}

function deleteExperience(n) {
  saveExperiences();
  experiences.splice(n, 1); // delete the element
  redrawExperiences();
}

function experiencesXP() {
  return 0;
}
