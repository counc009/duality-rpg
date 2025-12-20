var relic_addon_options = ['Ability', 'Attribute', 'Block', 'Experience', 'Life', 'Recovery', 'Specialization']
var weapon_addon_options = ['Ability', 'Attribute', 'Block', 'Experience', 'Life', 'Recovery', 'Specialization', 'Style']

var items = [];

function new_weapon_style() {
  let res = { style: '' };

  let style = document.createElement('select');
  addOptions(style, offensives.map((s) => (s.kind)).concat(defensives.map((s) => (s.kind))), 0);
  style.onchange = function() { res.style = style.value; };

  res.div = style;
  return res;
}

function new_item_adds(addon_options) {
  let addons = { addons: [] };

  let res = document.createElement('div');

  let addons_div = document.createElement('div');
  res.appendChild(addons_div);

  let add = document.createElement('select');
  addOptions(add, addon_options, 0, 'Add...');
  add.onchange = function() {
    switch (add.value) {
      case 'Ability':
        let ability = new_ability((ability) =>
          (() => {
            let idx = addons.addons.indexOf(ability);
            addons.addons.splice(idx, 1);
            ability.div.remove();
            updateXP();
          }));
        ability.addon_kind = 'ability';

        addons_div.appendChild(ability.div);
        addons.addons.push(ability);
        break;
      case 'Attribute':
        let attribute_addon = { addon_kind: 'attribute', stat: '', bonus: 0 };

        let attribute_div = document.createElement('div');

        let attribute_select = document.createElement('select');
        addOptions(attribute_select, stats, selected=0);
        attribute_select.onchange = function() { attribute_addon.stat = attribute_select.value; };
        attribute_div.appendChild(attribute_select);

        let attribute_bonus = document.createElement('input');
        attribute_bonus.setAttribute('type', 'number');
        attribute_bonus.className = 'bonus';
        attribute_bonus.value = 0;
        attribute_bonus.onchange = function() {
          let val = parseInt(attribute_bonus.value);

          if (val == NaN) {
            val = attribute_addon.bonus;
          } else if (val < 0) {
            val = 0;
          } else if (val > 2 && creation_mode){
            val = 2;
          } else if (val > 3) {
            val = 3;
          }

          attribute_addon.bonus = val;
          attribute_bonus.value = val;
          updateXP();
        };
        attribute_div.appendChild(attribute_bonus);

        let attribute_del = document.createElement('button');
        attribute_del.setAttribute('type', 'button');
        attribute_del.textContent = 'X';
        attribute_del.onclick = function() {
          let idx = addons.addons.indexOf(attribute_addon);
          addons.addons.splice(idx, 1);
          attribute_div.remove();
          updateXP();
        };
        attribute_div.appendChild(attribute_del);

        attribute_addon.div = attribute_div;
        addons_div.appendChild(attribute_div);
        addons.addons.push(attribute_addon);
        break;
      case 'Block':
        let block_addon = { addon_kind: 'block', bonus: 0 };

        let block_div = document.createElement('div');

        let block_label = document.createElement('b');
        block_label.textContent = 'Block ';
        block_div.appendChild(block_label);

        let block_bonus = document.createElement('input');
        block_bonus.setAttribute('type', 'number');
        block_bonus.className = 'bonus';
        block_bonus.value = 0;
        block_bonus.onchange = function() {
          let val = parseInt(block_bonus.value);

          if (val == NaN) {
            val = block_addon.bonus;
          } else if (val < 0) {
            val = 0;
          } else if (val > 2 && creation_mode) {
            val = 2;
          } else if (val > 3) {
            val = 3;
          }

          block_addon.bonus = val;
          block_bonus.value = val;
          updateXP();
        };
        block_div.appendChild(block_bonus);

        let block_del = document.createElement('button');
        block_del.setAttribute('type', 'button');
        block_del.textContent = 'X';
        block_del.onclick = function() {
          let idx = addons.addons.indexOf(block_addon);
          addons.addons.splice(idx, 1);
          block_div.remove();
          updateXP();
        };
        block_div.appendChild(block_del);

        block_addon.div = block_div;
        addons_div.appendChild(block_div);
        addons.addons.push(block_addon);
        break;
      case 'Experience':
        let exp = new_experience((exp) =>
          (() => {
            let idx = addons.addons.indexOf(exp);
            addons.addons.splice(idx, 1);
            exp.div.remove();
            updateXP();
          }));
        exp.addon_kind = 'experience';

        addons_div.appendChild(exp.div);
        addons.addons.push(exp);
        break;
      case 'Life':
        let life_addon = { addon_kind: 'life', bonus: 0 };

        let life_div = document.createElement('div');

        let life_label = document.createElement('b');
        life_label.textContent = 'Life ';
        life_div.appendChild(life_label);

        let life_bonus = document.createElement('input');
        life_bonus.setAttribute('type', 'number');
        life_bonus.className = 'bonus';
        life_bonus.value = 0;
        life_bonus.onchange = function() {
          let val = parseInt(life_bonus.value);

          if (val == NaN) {
            val = life_addon.bonus;
          } else if (val < 0) {
            val = 0;
          } else if (val > 10) {
            val = 10;
          }

          life_addon.bonus = val;
          life_bonus.value = val;
          updateXP();
        };
        life_div.appendChild(life_bonus);

        let life_del = document.createElement('button');
        life_del.setAttribute('type', 'button');
        life_del.textContent = 'X';
        life_del.onclick = function() {
          let idx = addons.addons.indexOf(life_addon);
          addons.addons.splice(idx, 1);
          life_div.remove();
          updateXP();
        };
        life_div.appendChild(life_del);

        life_addon.div = life_div;
        addons_div.appendChild(life_div);
        addons.addons.push(life_addon);
        break;
      case 'Recovery':
        let recovery_addon = { addon_kind: 'recovery', bonus: 0 };

        let recovery_div = document.createElement('div');

        let recovery_label = document.createElement('b');
        recovery_label.textContent = 'Recovery ';
        recovery_div.appendChild(recovery_label);

        let recovery_bonus = document.createElement('input');
        recovery_bonus.setAttribute('type', 'number');
        recovery_bonus.className = 'bonus';
        recovery_bonus.value = 0;
        recovery_bonus.onchange = function() {
          let val = parseInt(recovery_bonus.value);

          if (val == NaN) {
            val = recovery_addon.bonus;
          } else if (val < 0) {
            val = 0;
          } else if (val > 5) {
            val = 5;
          }

          recovery_addon.bonus = val;
          recovery_bonus.value = val;
          updateXP();
        };
        recovery_div.appendChild(recovery_bonus);

        let recovery_del = document.createElement('button');
        recovery_del.setAttribute('type', 'button');
        recovery_del.textContent = 'X';
        recovery_del.onclick = function() {
          let idx = addons.addons.indexOf(recovery_addon);
          addons.addons.splice(idx, 1);
          recovery_div.remove();
          updateXP();
        };
        recovery_div.appendChild(recovery_del);

        recovery_addon.div = recovery_div;
        addons_div.appendChild(recovery_div);
        addons.addons.push(recovery_addon);
        break;
      case 'Specialization':
        let spec = new_spec((spec) =>
          (() => {
            let idx = addons.addons.indexOf(spec);
            addons.addons.splice(idx, 1);
            spec.div.remove();
            updateXP();
          }));
        spec.addon_kind = 'specialization';

        addons_div.appendChild(spec.div);
        addons.addons.push(spec);
        break;
      case 'Style':
        let style = new_weapon_style();
        style.addon_kind = 'style';

        let style_div = document.createElement('div');
        style_div.appendChild(style.div);
        style.div = style_div;

        let style_del = document.createElement('button');
        style_del.setAttribute('type', 'button');
        style_del.textContent = 'X';
        style_del.onclick = function() {
          let idx = addons.addons.indexOf(style);
          addons.addons.splice(idx, 1);
          style_div.remove();
          updateXP();
        };
        style_div.appendChild(style_del);

        addons_div.appendChild(style_div);
        addons.addons.push(style);
        break;
    }

    // And reset the add button
    add.value = 'Add...';
  };
  res.appendChild(add);

  addons.div = res;
  return addons;
}

function new_weapon() {
  let addons = new_item_adds(weapon_addon_options);
  let weapon = { kind: 'weapon', name: '', style: '', bonus: 0, feature: 0,
                 addons: addons };

  let weapon_div = document.createElement('div');
  weapon_div.className = 'item';

  let name = document.createElement('input');
  name.setAttribute('type', 'text');
  name.className = 'itemName';
  name.onchange = function() { weapon.name = name; };
  weapon_div.appendChild(name);

  let style = new_weapon_style();
  weapon.style = style;
  weapon_div.appendChild(style.div);

  let del = document.createElement('button');
  del.setAttribute('type', 'button');
  del.style.float = 'right';
  del.onclick = function() { deleteItem(weapon); };
  del.textContent = 'X';
  weapon_div.appendChild(del);

  // Add a line break
  weapon_div.appendChild(document.createElement('br'));

  let property_div = document.createElement('div');

  let bonus_text = document.createElement('b');
  bonus_text.textContent = 'Bonus ';
  property_div.appendChild(bonus_text);

  let bonus = document.createElement('input');
  bonus.setAttribute('type', 'number');
  bonus.className='bonus';
  bonus.value = 0;
  bonus.onchange = function() {
    let val = parseInt(bonus.value);

    if (val == NaN) {
      val = weapon.bonus;
    } else if (val < 1) {
      val = 1;
    } else if (val > 2 && creation_mode) {
      val = 2;
    } else if (val > 3) {
      val = 3;
    }

    weapon.bonus = val;
    bonus.value = val;
    updateXP();
  };
  property_div.appendChild(bonus);

  let feature_text = document.createElement('b');
  property_div.appendChild(feature_text);

  let feature = document.createElement('input');
  feature.setAttribute('type', 'number');
  feature.className='bonus';
  feature.value = 0;
  feature.onchange = function() {
    let val = parseInt(feature.value);

    if (val == NaN) {
      val = weapon.feature;
    } else if (val < 1) {
      val = 1;
    } else if (val > 2 && isDefensive(weapon.style)) {
      // If it's defensive, the maximum block bonus is +2
      val = 2;
    } else if (val > 3) {
      // If it's offensive, the maximum number of dice is 3
      val = 3;
    }

    weapon.feature = val;
    feature.value = val;
    updateXP();
  };
  property_div.appendChild(feature);

  property_div.style.display = 'none';
  weapon_div.appendChild(property_div);

  style.div.onchange = function() {
    style.style = style.div.value;
    weapon.bonus = 1;
    weapon.feature = 1;

    bonus.value = 1;
    feature.value = 1;

    if (isDefensive(style.style)) {
      feature_text.textContent = ' Block ';
    } else {
      feature_text.textContent = ' Dice ';
    }

    property_div.style.display = 'inline';
  };

  weapon_div.appendChild(addons.div);

  weapon.div = weapon_div;
  return weapon;
}

function new_relic() {
  let addons = new_item_adds(relic_addon_options);
  let relic = { kind: 'relic', name: '', bonus: 1, experience: '',
                addons: addons };

  let relic_div = document.createElement('div');
  relic_div.className = 'item';

  let name = document.createElement('input');
  name.setAttribute('type', 'text');
  name.className = 'itemName';
  name.onchange = function() { relic.name = name; };
  relic_div.appendChild(name);

  let bonus = document.createElement('input');
  bonus.setAttribute('type', 'number');
  bonus.className='bonus';
  bonus.value = 1;
  bonus.onchange = function() {
    let val = parseInt(bonus.value);

    if (val == NaN) {
      val = weapon.bonus;
    } else if (val < 1) {
      val = 1;
    } else if (val > 2 && creation_mode) {
      val = 2;
    } else if (val > 3) {
      val = 3;
    }

    relic.bonus = val;
    bonus.value = val;
    updateXP();
  };
  relic_div.appendChild(bonus);

  let experience = document.createElement('input');
  experience.setAttribute('type', 'text');
  experience.onchange = function() { relic.experience = experience.value; };
  relic_div.appendChild(experience);

  let del = document.createElement('button');
  del.setAttribute('type', 'button');
  del.style.float = 'right';
  del.onclick = function() { deleteItem(relic); };
  del.textContent = 'X';
  relic_div.appendChild(del);

  relic_div.appendChild(addons.div);

  relic.div = relic_div;
  return relic;
}

function addWeapon() {
  let item = new_weapon();
  items.push(item);
  document.getElementById('items').appendChild(item.div);
}

function addRelic() {
  let item = new_relic();
  items.push(item);
  document.getElementById('items').appendChild(item.div);
}

function deleteItem(item) {
  let idx = items.indexOf(item);
  items.splice(idx, 1); // delete the item
  item.div.remove();
  updateXP();
}
