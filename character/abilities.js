const ability_kinds = ["Take the Advantage", "Good Under Pressure", "Tank", "Natural Healer", "Powerful Healer", "Draw Blood"];

var abilities = [];

function saveAbilities() {
  for ([idx, abil] of abilities.entries()) {
    abil.kind  = document.getElementById("akind"  + idx).value;
    abil.level = document.getElementById("alevel" + idx).value;
  }
}

function redrawAbilities() {
  let abils = document.getElementById("abilities");

  while (abils.firstChild) {
    abils.removeChild(abils.firstChild);
  }

  for (const [idx, abil] of abilities.entries()) {
    let abil_div = document.createElement('div');
    abil_div.className = "ability";
    abil_div.setAttribute("id", "ability" + idx);

    // Create the ability kind drop-down
    let kind = document.createElement('select');
    kind.setAttribute("name", "akind" + idx);
    kind.setAttribute("id", "akind" + idx);

    let kind_empty = document.createElement('option');
    kind_empty.setAttribute("disabled", "");
    if (abil.kind == "") {
      kind_empty.setAttribute("selected", "");
    }
    kind_empty.setAttribute("value", "");
    kind.appendChild(kind_empty);

    for (const v of ability_kinds) {
      let kind_option = document.createElement('option');
      kind_option.setAttribute("value", v);
      kind_option.textContent = v;

      if (abil.kind == v) {
        kind_option.setAttribute("selected", "");
      }

      kind.appendChild(kind_option);
    }

    abil_div.append(kind);

    // Create the level input
    let level = document.createElement('input');
    level.setAttribute("name", "alevel" + idx);
    level.setAttribute("id", "alevel" + idx);
    level.setAttribute("type", "number");
    level.className = "bonus";
    level.value = abil.level;
    abil_div.append(level);

    // Create the delete button
    let del = document.createElement('button');
    del.setAttribute("type", "button");
    del.setAttribute("onclick", "deleteAbility(" + idx + ")");
    del.textContent = "X";
    abil_div.append(del);

    abils.appendChild(abil_div);
  }
}

function addAbility() {
  saveAbilities();
  abilities.push({kind: '', level: ''});
  redrawAbilities();
}

function deleteAbility(n) {
  saveAbilities();
  abilities.splice(n, 1); // delete the element
  redrawAbilities();
}

function abilitiesXP() {
  return 0;
}
