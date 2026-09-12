// Initialize these numbers with -1 so that we can identify if they should be
// reset by loading the character sheet
var curlife = -1;
var curmain = -1;
var curdefend = -1;

// Advantage is 0 until the user increases it
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

function curmainChange() {
  let val = parseInt(document.getElementById('sheet-curmain').value);

  if (val == NaN) {
    val = curmain;
  } else if (val < 0) {
    val = 0;
  }

  curmain = val;
  document.getElementById('sheet-curmain').value = val;
}

function curdefendChange() {
  let val = parseInt(document.getElementById('sheet-curdefend').value);

  if (val == NaN) {
    val = curdefend;
  } else if (val < 0) {
    val = 0;
  }

  curdefend = val;
  document.getElementById('sheet-curdefend').value = val;
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
    extra: 0
  });

  let advncd = {};
  clearChildren(document.getElementById('sheet-advanced-actions'));

  let n_main = 1;
  let n_defend = 1;
  let n_carryover = 0;
  for (const option of advanced) {
    advncd[option.kind] = option;

    switch (option.kind) {
      case 'Additional Defend Actions':
        n_defend += option.count;
        break;
      case 'Additional Main Actions':
        n_main += option.count;
        break;
      case 'Action Carryover':
        n_carryover += option.count;
        break;
      case 'Wide Barrage': {
        let row = createTextRow(['Wide Barrage', '(Main)',
                                  'target multiple enemies ' + option.range]);
        document.getElementById('sheet-advanced-actions').appendChild(row);
        break;
      }
      case 'Critical Attack': {
        let row = createTextRow(['Critical Attack', '(Main)',
                                  'double damage']);
        document.getElementById('sheet-advanced-actions').appendChild(row);
        break;
      }
      case 'Dedicated Healer': {
        let row = createTextRow(['Dedicated Healer', '(Defend)',
                                  ('ignore advantage cost of triage'
                                  + (option.upgraded ? ' and increase roll' : ''))]);
        document.getElementById('sheet-advanced-actions').appendChild(row);
        break;
      }
      case 'Transformation': {
        let row = document.createElement('tr');

        row.insertCell().textContent = 'Transformation';
        row.insertCell().textContent = '(Main + Defend)';

        let desc = row.insertCell();
        desc.appendChild(document.createTextNode(`(or ${option.uses})`));
        desc.appendChild(document.createElement('br'));
        desc.appendChild(document.createTextNode('For the remainder of the scene or until you end the transformation:'));
        let details = document.createElement('ul');
        desc.appendChild(details);

        if (!option.keep) {
          details.appendChild(textListElem('You cannot use any Specialization except any granted by the Senses option'));
        }
        if (option.swim) {
          details.appendChild(textListElem(`You gain a swim speed of ${speeds.walk}`));
        }
        if (option.climb) {
          details.appendChild(textListElem(`You gain a climb speed of ${speeds.walk}`));
        }
        if (option.burrow) {
          details.appendChild(textListElem(`You gain a burrow speed of ${speeds.walk}`));
        }
        if (option.fly) {
          details.appendChild(textListElem(`You gain a fly speed of ${speeds.walk}`));
        }

        let option_label = document.createElement('li');
        let options = document.createElement('ul');
        option_label.appendChild(document.createTextNode(`Pick ${option.count} of the following`));
        option_label.appendChild(options);
        details.appendChild(option_label);

        options.appendChild(textListElemLabeled('Defense',
          `current and max Life increase by ${option.up_life ? 20 : 10}${option.neg_life == 'none' ? '' : option.neg_life == 'reduced' ? ' but cannot use benefits other than die, range, and basic statistic of Offensive combat styles' : ' but cannot use benefits other than range and basic statistic of offensive combat styles'}`));
        options.appendChild(textListElemLabeled('Offense',
          `add ${option.up_damage ? 'two damage dice' : 'one damage die'} to all damage rolls${option.neg_damage == 'reduced' ? ' and gain +1 bonus to all rolls to defend' : ''}${option.neg_damage == 'none' ? '' : ' but cannot use benefits other than basic statistic of Defensive combat styles'}`));
        options.appendChild(textListElemLabeled('Agility',
          `speed is doubled and gain a +${option.up_agility ? 4 : 2} bonus to all Finesse rolls${option.neg_agility == 'none' ? '' : ' but suffer a -1 penalty to Strength ' + (option.neg_agility == 'reduced' ? 'or' : 'and') + ' Willpower rolls'}`));
        options.appendChild(textListElemLabeled('Senses',
          `gain a +${option.up_senses ? 4 : 2} bonus to all Instinct rolls and a +1 bonus to a single Perceive specialization with the Superhuman tag${option.neg_senses == 'none' ? '' : ' but suffer a -1 penalty to Presence ' + (option.neg_senses == 'reduced' ? 'or' : 'and') + ' Knowledge rolls'}`));

        document.getElementById('sheet-advanced-actions').appendChild(row);
        break;
      }
    }
  }

  for (const item of items) {
    let styles = [];

    if (!item.equipped) { continue; }

    switch (item.kind) {
      case 'weapon':
        styles.push(item.style.style); // Add our initial style
        weapons.push({ name: item.name, styles: styles, bonus: item.bonus,
                        extra: item.feature });
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

  curlife = curlife < 0 ? attrs.life : curlife;
  document.getElementById('sheet-curlife').value = curlife;

  for (const [kind, speed] of Object.entries(speeds)) {
    document.getElementById('sheet-' + kind).textContent = speed;
  }

  document.getElementById('sheet-mains').textContent = n_main;
  document.getElementById('sheet-defends').textContent = n_defend;
  document.getElementById('sheet-carryover').textContent = n_carryover;

  curmain = curmain < 0 ? n_main : curmain;
  curdefend = curdefend < 0 ? n_defend : curdefend;

  document.getElementById('sheet-curmain').value = curmain;
  document.getElementById('sheet-curdefend').value = curdefend;

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
        } else if (style == 'Melee' || style == 'Ranged') {
          bonus += offns[style].bonus;
        }
        let style_bonus = document.createElement('td');
        style_bonus.textContent =
          style == 'Assassin' ? 'auto hit'
          : (bonus >= 0 ? ('+' + bonus) : bonus) + ' to attack';
        style_info.appendChild(style_bonus);

        let base_dice =
          style == 'Assassin' && advncd['Assassin'].upgraded ? 2 : 1;
        let dice =
          weapon.extra == 0
          ? (base_dice == 1 ? '' : base_dice) + offns[style].die
          : (offns[style].die == weapon.extra
            ? (base_dice + 1) + offns[style].die
            : ((base_dice == 1 ? '' : base_dice) + offns[style].die 
              + ' + ' + weapon.extra));
        let style_damage = document.createElement('td');
        style_damage.textContent = dice + ' + ' + bonus;
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
        if (style == 'Evasive') { bonus += defns[style].extra; }
        let style_bonus = document.createElement('td');
        style_bonus.textContent = (bonus >= 0 ? ('+' + bonus) : bonus)
                                + ' to defend';
        style_info.appendChild(style_bonus);

        let block = attrs.block + (style == 'Shielded' ? defns[style].extra : 0)
                  + weapon.extra;
        let style_block = document.createElement('td');
        style_block.textContent = block + ' Block';
        style_info.appendChild(style_block);

        if (style == 'Armored') {
          let note = document.createElement('td');
          let ab = bonus - 3;
          note.textContent =
            '(or ' + (ab >= 0 ? ('+' + ab) : ab)
            + ' to defend without using a Defend Action)';
          style_info.appendChild(note);
        } else if (style == 'Riposte') {
          let note = document.createElement('td');
          let die = defns[style].extra;
          note.textContent = 'always deal ' + die + ' to attacker';
          style_info.appendChild(note);
        } else if (style == 'Blink') {
          let note = document.createElement('td');
          note.textContent = 'teleport a ' + defns['Blink'].extra
                           + ' and potentially reduce damage';
          style_info.appendChild(note);
        } else if (style == 'Undying Fortitude') {
          let note = document.createElement('td');
          note.textContent = 'life cannot be reduced below 1 except on a Very Bad outcome';
          style_info.appendChild(note);
        }
      }
    }

    for (const div of offensive_lst) { styles.appendChild(div); }
    for (const div of defensive_lst) { styles.appendChild(div); }

    document.getElementById('sheet-weapons').appendChild(weapon_info);
  }
}

function createTextRow(cols) {
  let row = document.createElement('tr');

  for (const text of cols) {
    let col = document.createElement('td');
    col.textContent = text;
    row.appendChild(col);
  }

  return row;
}

function textListElem(txt) {
  let elem = document.createElement('li');
  elem.textContent = txt;
  return elem;
}

function textListElemLabeled(label, body) {
  let elem = document.createElement('li');
  let label_node = document.createElement('strong');
  label_node.appendChild(document.createTextNode(label));
  label_node.appendChild(document.createTextNode(': '));
  elem.appendChild(label_node);
  elem.appendChild(document.createTextNode(body));
  return elem;
}
