// A character's current life (starts at 20 to match the initial max life)
var curlife = 20;
// The number of advantage the character has
var advantage = 0;

function curlifeChange() {
  let val = parseInt(document.getElementById('sheet-curlife').value);

  if (val == NaN) {
    val = curlife;
  } else if (val < 0) {
    val = 0;
  } else if (val > attributes.life) {
    val = attributes.life;
  }

  curlife = val;
  document.getElementById('sheet-curlife').value = val;
}

function advantageChange() {
  let val = parseInt(document.getElementById('sheet-advantage').value);

  if (val == NaN) {
    val = advantage;
  } else if (val < 0) {
    val = 0;
  }

  advantage = val;
  document.getElementById('sheet-advantage').value = val;
}

function gotoBuilder(evt) {
  document.getElementById('builder').style.display = 'block';
  document.getElementById('sheet').style.display = 'none';

  for (const tab of document.getElementsByClassName('tablinks')) {
    tab.className = tab.className.replace(' active', '');
  }

  evt.currentTarget.className += " active";
}

function gotoSheet(evt) {
  setupSheet();

  // Hacky way of determining if we have negative XP left
  if (document.getElementById('rem-xp').style.color == 'red') {
    alert('Character has negative XP left');
  }

  document.getElementById('builder').style.display = 'none';
  document.getElementById('sheet').style.display = 'block';

  for (const tab of document.getElementsByClassName('tablinks')) {
    tab.className = tab.className.replace(' active', '');
  }

  evt.currentTarget.className += " active";
}

function setupSheet() {
  let name = document.getElementById('name').value;

  let stats = {
    strength: statistics.strength,
    finesse: statistics.finesse,
    willpower: statistics.willpower,
    instinct: statistics.instinct,
    presence: statistics.presence,
    knowledge: statistics.knowledge,
  };
  let attrs = {
    life: attributes.life,
    recovery: attributes.recovery,
    block: attributes.block,
    wealth: attributes.wealth,
  };

  let specs = {};
  for (const spec of specializations) {
    let key = spec.verb + ' ' + spec.noun;
    specs[key] = { tag: spec.tag, bonus: spec.bonus };
  }

  let exprs = {};
  for (const exp of experiences) {
    exprs[exp.desc] = exp.bonus;
  }

  let abils = {};
  for (const abil of abilities) {
    abils[abil.kind] = abil.level;
  }

  let offns = {};
  for (const style of offensives) {
    offns[style.kind] = {
      stat: style.stat,
      bonus: style.bonus,
      dice: style.dice,
      die: style.die,
      range: style.range,
      spec: style.spec
    };

    if (style.kind == 'Melee' || style.kind == 'Ranged') {
      exprs[style.experience] = style.bonus;
    }
  }

  let defns = {};
  for (const style of defensives) {
    defns[style.kind] = style;
  }

  let item_bonuses = {
    stats: { strength: 0, finesse: 0, willpower: 0, instinct: 0, presence: 0, knowledge: 0 },
    attrs: { life: 0, recovery: 0, block: 0 },
    specs: { },
    exprs: { },
    abils: { },
  };
  let weapons = [];

  // Add unarmed as a weapon with all styles and no bonuses or dice
  weapons.push({
    name: "Unarmed",
    styles: Object.keys(offns).concat(Object.keys(defns)), 
    bonus: 0,
    dice: 0
  });

  for (const item of items) {
    let styles = [];

    if (!item.equipped) { continue; }

    switch (item.kind) {
      case 'weapon':
        styles.push(item.style.style); // Add our initial style
        weapons.push({ name: item.name, styles: styles, bonus: item.bonus, dice: item.feature });
        break;
      case 'relic':
        if (!(item.experience in item_bonuses.exprs)
          || (item_bonuses.exprs[item.experience] < item.bonus)) {
            item_bonuses.exprs[item.experience] = item.bonus;
        }
        break;
    }

    for (const addon of item.addons.addons) {
      switch (addon.addon_kind) {
        case 'Ability':
          item_bonuses.abils[addon.kind] = addon.level;
          break;
        case 'Attribute':
          let stat = addon.stat.toLowerCase();
          item_bonuses.stats[stat] = Math.max(item_bonuses.stats[stat], addon.bonus);
          break;
        case 'Block':
          item_bonuses.attrs.block = Math.max(item_bonuses.attrs.block, addon.bonus);
          break;
        case 'Experience':
          if (!(addon.desc in item_bonuses.exprs)
            || (item_bonuses.exprs[addon.desc] < addon.bonus)) {
              item_bonuses.exprs[addon.desc] = addon.bonus;
          }
          break;
        case 'Life':
          item_bonuses.attrs.life = Math.max(item_bonuses.attrs.life, addon.bonus);
          break;
        case 'Recovery':
          item_bonuses.attrs.recovery = Math.max(item_bonuses.attrs.recovery, addon.bonus);
          break;
        case 'Specialization':
          let key = addon.verb + ' ' + addon.noun;
          if (!(key in item_bonuses.specs)
            || (item_bonuses.specs[key] < addon.bonus)) {
            item_bonuses.specs[key] = { tag: addon.tag, bonus: addon.bonus };
          }
          break;
        case 'Style':
          styles.push(addon.style);
          break;
      }
    }
  }

  stats.strength += item_bonuses.stats.strength;
  stats.finesse += item_bonuses.stats.finesse;
  stats.willpower += item_bonuses.stats.willpower;
  stats.instinct += item_bonuses.stats.instinct;
  stats.presence += item_bonuses.stats.presence;
  stats.knowledge += item_bonuses.stats.knowledge;

  attrs.life += item_bonuses.attrs.life;
  attrs.recovery += item_bonuses.attrs.recovery;
  attrs.block += item_bonuses.attrs.block;

  for (const [key, spec] of Object.entries(item_bonuses.specs)) {
    if (!(key in specs) && spec.tag != 'Just Bonus') {
      specs[key] = spec;
    } else if (key in specs) {
      specs[key].bonus += spec.bonus;
    }
  }

  for (const [expr, bonus] of Object.entries(item_bonuses.exprs)) {
    if (!(expr in exprs) || (exprs[expr].bonus < bonus)) {
      exprs[expr] = bonus;
    }
  }

  for (const [abil, level] of Object.entries(item_bonuses.abils)) {
    if (!(abil in abils) || (abils[abil] < level)) {
      abils[abil] = level;
    }
  }

  document.getElementById('sheet-name').textContent = name;

  document.getElementById('sheet-advantage').value = advantage;

  for (const [stat, bonus] of Object.entries(stats)) {
    document.getElementById('sheet-' + stat).textContent = bonus >= 0 ? ('+' + bonus) : bonus;
  }

  for (const [attr, value] of Object.entries(attrs)) {
    document.getElementById('sheet-' + attr).textContent = value;
  }

  document.getElementById('sheet-curlife').value = curlife;

  for (const [kind, speed] of Object.entries(speeds)) {
    document.getElementById('sheet-' + kind).textContent = speed;
  }

  clearChildren(document.getElementById('sheet-specializations'));
  for (const [spec, info] of Object.entries(specs)) {
    let spec_name = document.createElement('td');
    spec_name.textContent = spec + ' (' + info.tag + ') ';

    let spec_bonus = document.createElement('td');
    spec_bonus.textContent = '+' + info.bonus;

    let spec_desc = document.createElement('tr');
    spec_desc.appendChild(spec_name);
    spec_desc.appendChild(spec_bonus);

    document.getElementById('sheet-specializations').appendChild(spec_desc);
  }

  clearChildren(document.getElementById('sheet-experiences'));
  for (const [expr, bonus] of Object.entries(exprs)) {
    let expr_name = document.createElement('td');
    expr_name.textContent = expr;

    let expr_bonus = document.createElement('td');
    expr_bonus.textContent = '+' + bonus;

    let expr_desc = document.createElement('tr');
    expr_desc.appendChild(expr_name);
    expr_desc.appendChild(expr_bonus);

    document.getElementById('sheet-experiences').appendChild(expr_desc);
  }

  clearChildren(document.getElementById('sheet-abilities'));
  for (const [abil, level] of Object.entries(abils)) {
    let abil_name = document.createElement('td');
    abil_name.textContent = abil;

    let abil_level = document.createElement('td');
    abil_level.textContent = level;

    let abil_desc = document.createElement('tr');
    abil_desc.appendChild(abil_name);
    abil_desc.appendChild(abil_level);

    document.getElementById('sheet-abilities').appendChild(abil_desc);
  }

  clearChildren(document.getElementById('sheet-weapons'));
  for (const weapon of weapons) {
    let weapon_info = document.createElement('div');

    // Name
    let weapon_name = document.createElement('h4');
    weapon_name.textContent = weapon.name;
    weapon_info.appendChild(weapon_name);

    let styles = document.createElement('table');
    styles.className = 'spacedTable';
    weapon_info.append(styles);

    let offensive_lst = [];
    let defensive_lst = [];

    for (const style of weapon.styles) {
      let style_info = document.createElement('tr');

      if (isOffensive(style)) {
        offensive_lst.push(style_info);

        let style_name = document.createElement('td');
        style_name.textContent = style;
        style_info.appendChild(style_name);

        let bonus = stats[offns[style].stat.toLowerCase()] + weapon.bonus;
        if (style == 'Simple & Weak' || style == 'Complex & Powerful') {
          bonus += specs[offns[style].spec].bonus;
        } else {
          bonus += offns[style].bonus;
        }
        let style_bonus = document.createElement('td');
        style_bonus.textContent = bonus >= 0 ? ('+' + bonus) : bonus;
        style_info.appendChild(style_bonus);

        let dice = offns[style].dice + weapon.dice;
        let die = offns[style].die;
        let style_damage = document.createElement('td');
        style_damage.textContent = dice + die + ' + ' + stats[offns[style].stat.toLowerCase()];
        style_info.appendChild(style_damage);

        let style_range = document.createElement('td');
        style_range.textContent = offns[style].range;
        style_info.appendChild(style_range);
      } else {
        defensive_lst.push(style_info);

        let style_name = document.createElement('td');
        style_name.textContent = style;
        style_info.appendChild(style_name);
        
        let bonus = stats[defns[style].stat.toLowerCase()] + weapon.bonus;
        if (style == 'Evasive') { bonus += defns[style].value; }
        let style_bonus = document.createElement('td');
        style_bonus.textContent = bonus >= 0 ? ('+' + bonus) : bonus;
        style_info.appendChild(style_bonus);

        let block = attrs.block + (style == 'Armored' ? defns[style].value : 0);
        let style_block = document.createElement('td');
        style_block.textContent = block + ' Block';
        style_info.appendChild(style_block);

        if (style == 'Shielded') {
          let shield_note = document.createElement('td');
          let bonus = stats[defns[style].stat.toLowerCase()];
          shield_note.textContent =
            'spend (up to ' + defns[style].value + ') Advantage for ' + bonus + ' additional block each';
          style_info.appendChild(shield_note);
        } else if (style == 'Riposte') {
          let riposte_note = document.createElement('td');
          let bonus = stats[defns[style].stat.toLowerCase()];
          let dice = defns[style].value;
          riposte_note.textContent =
            'deal ' + dice + 'd6 + ' + bonus + ' to attacker';
          style_info.appendChild(riposte_note);
        }
      }
    }

    for (const div of offensive_lst) { styles.appendChild(div); }
    for (const div of defensive_lst) { styles.appendChild(div); }

    document.getElementById('sheet-weapons').appendChild(weapon_info);
  }
}
