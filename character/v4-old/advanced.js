const advanced_options = ['Assassin', 'Blink', 'Undying Fortitude',
  'Wide Barrage', 'Critical Attack', 'Dedicated Healer', 'Transformation',
  'Additional Defend Actions', 'Additional Main Actions', 'Action Carryover'];
var advanced = [];

function is_offensive_style(kind) {
  switch (kind) {
    case 'Assassin':
      return true;
    default:
      return false;
  }
}

function is_defensive_style(kind) {
  switch (kind) {
    case 'Blink':
    case 'Undying Fortitude':
      return true;
    default:
      return false;
  }
}

// Helper functions for creating elements which which are set to not displayed
function create_select(where) {
  let s = document.createElement('select');
  s.style.display = 'none';
  where.appendChild(s);
  return s;
}

function create_label_select(where) {
  let s = new LabeledSelector(where);
  s.display = 'none';
  return s;
}

function create_check(where) {
  let c = new CheckBox(where);
  c.display = 'none';
  return c;
}

function create_number(where) {
  let n = document.createElement('input');
  n.setAttribute('type', 'number');
  n.style.display = 'none';
  n.className = 'bonus';
  where.appendChild(n);
  return n;
}

function none_displays(elems) {
  for (const elem of elems) {
    if (elem instanceof CheckBox || elem instanceof LabeledSelector) {
      elem.display = 'none';
    } else {
      elem.style.display = 'none';
    }
  }
}

function clear_selectors(elems) {
  for (const elem of elems) {
    if (elem instanceof LabeledSelector) {
      elem.options = [];
    } else {
      while (elem.firstChild) {
        elem.removeChild(elem.firstChild);
      }
    }
  }
}

// SELECTOR
// SELECTORS <1> <2>  CHECK <3>   NUMBER <4>
// CHECKS <A> <B> <C> <D>
// CHECKS <W> <X> <Y> <Z>
// SELECTORS <P> <Q> <R> <S>

// Assassin
// - Gain 1 advantage (check 3)
// Blink
// --
// Undying Fortitude
// --
// Wide Barrage
// - Distance (selector 1)
// Critical Attack
// --
// Dedicated Healer
// - Increase roll (check 3)
// Additional Defend Actions
// - Number (number 4)
// Additional Main Actions
// - Number (number 4)
// Action Carryover
// - Number (number 4)
//
// Transformation
//   - Frequency (selector 1)
//   - Number of options (selector 2)
//   - Keep Specializations (check 3)
//   - Swim/Climb/Burrow/Fly speed (checks A, B, C, D)
//   - Option upgrades (checks W, X, Y, Z)
//   - Option downside (selectors P, Q, R, S)

function new_advanced(
  option = { kind : '' }
) {
  let div = document.createElement('div');
  div.className = 'advancedOption';

  // Create the selector drop-down
  let kind = document.createElement('select');
  addOptions(kind, advanced_options, 0);

  kind.value = option.kind;
  div.appendChild(kind);

  // Delete button
  let del = document.createElement('button');
  del.setAttribute('type', 'button');
  del.onclick = function() { deleteAdvanced(option); };
  del.textContent = 'X';
  del.style.float = 'right';
  div.appendChild(del);

  // All the option controls
  let row1 = document.createElement('div');

  let selector1 = create_select(row1);
  let selector2 = create_select(row1);
  let check3 = create_check(row1);
  let number4 = create_number(row1);

  div.appendChild(row1);

  let row2 = document.createElement('div');

  let checkA = create_check(row2);
  let checkB = create_check(row2);
  let checkC = create_check(row2);
  let checkD = create_check(row2);

  div.appendChild(row2);

  let row3 = document.createElement('div');

  let checkW = create_check(row3);
  let checkX = create_check(row3);
  let checkY = create_check(row3);
  let checkZ = create_check(row3);

  div.appendChild(row3);

  let row4 = document.createElement('div');

  let selectorP = create_label_select(row4);
  let selectorQ = create_label_select(row4);
  let selectorR = create_label_select(row4);
  let selectorS = create_label_select(row4);

  div.appendChild(row4);

  kind.onchange = function() {
    option.kind = kind.value;
    updateAdvancedCombatStyles();

    none_displays([ selector1, selector2, check3, number4,
                    checkA, checkB, checkC, checkD,
                    checkW, checkX, checkY, checkZ,
                    selectorP, selectorQ, selectorR, selectorS ]);

    clear_selectors([ selector1, selector2,
                      selectorP, selectorQ, selectorR, selectorS ]);

    switch (kind.value) {
      case 'Blink':
      case 'Undying Fortitude':
      case 'Critical Attack':
        break;
      case 'Wide Barrage':
        addOptions(selector1, ['near each other', 'in the same vicinity']);
        selector1.style.display = 'inline-block';

        option.range = 'near each other';
        selector1.onchange = function() {
          option.range = selector1.value;
          updateXP();
        };
        break;
      case 'Assassin':
      case 'Dedicated Healer':
        check3.text = kind.value == 'Assassin' ? 'Additional Damage Die' : 'Increase Roll';
        check3.checked = false;
        check3.display = 'inline-block';

        option.upgraded = false;
        check3.onchange = function() {
          option.upgraded = check3.checked;
          updateXP();
        };
        break;
      case 'Additional Defend Actions':
      case 'Additional Main Actions':
      case 'Action Carryover':
        number4.value = 1;
        number4.style.display = 'inline-block';

        option.count = 1;
        number4.onchange = function() {
          let val = parseInt(number4.value);

          if (val == NaN) {
            val = option.count;
          } else if (val < 1) {
            val = 1;
          }

          option.count = val;
          number4.value = val;
          updateXP();
        };
        break;
      case 'Transformation':
        addOptions(selector1,
          [ 'once per session out of combat',
            'five times per session out of combat',
            'unlimited times outside of combat']);
        selector1.style.display = 'inline-block';

        addOptions(selector2,
          [ '1 option', '2 options', '3 options', '4 options' ]);
        selector2.style.display = 'inline-block';

        check3.text = 'Keep Specialization';
        check3.checked = false;
        check3.display = 'inline-block';

        checkA.text = 'Swim';
        checkA.checked = false;
        checkA.display = 'inline-block';

        checkB.text = 'Climb';
        checkB.checked = false;
        checkB.display = 'inline-block';

        checkC.text = 'Burrow';
        checkC.checked = false;
        checkC.display = 'inline-block';

        checkD.text = 'Fly';
        checkD.checked = false;
        checkD.display = 'inline-block';

        checkW.text = 'Option Upgrades: Life';
        checkW.checked = false;
        checkW.display = 'inline-block';

        checkX.text = 'Damage';
        checkX.checked = false;
        checkX.display = 'inline-block';

        checkY.text = 'Agility';
        checkY.checked = false;
        checkY.display = 'inline-block';

        checkZ.text = 'Senses';
        checkZ.checked = false;
        checkZ.display = 'inline-block';

        selectorP.text = 'Negative Effects: Life';
        selectorP.options = ['full', 'reduced', 'none'];
        selectorP.display = 'inline-block';

        selectorQ.text = 'Damage';
        selectorQ.options = ['full', 'reduced', 'none'];
        selectorQ.display = 'inline-block';

        selectorR.text = 'Agility';
        selectorR.options = ['full', 'reduced', 'none'];
        selectorR.display = 'inline-block';

        selectorS.text = 'Senses';
        selectorS.options = ['full', 'reduced', 'none'];
        selectorS.display = 'inline-block';

        option.uses = 'once per session out of combat';
        option.count = '1 option';
        option.keep = false;
        option.swim = false;
        option.climb = false;
        option.burrow = false;
        option.fly = false;
        option.up_life = false;
        option.up_damage = false;
        option.up_agility = false;
        option.up_senses = false;
        option.neg_life = 'full';
        option.neg_damage = 'full';
        option.neg_agility = 'full';
        option.neg_senses = 'full';

        selector1.onchange = function() {
          option.uses = selector1.value;
          updateXP();
        };
        selector2.onchange = function() {
          option.count = selector2.value;
          updateXP();
        };
        check3.onchange = function() {
          option.keep = check3.checked;
          updateXP();
        };
        checkA.onchange = function() {
          option.swim = checkA.checked;
          updateXP();
        };
        checkB.onchange = function() {
          option.climb = checkB.checked;
          updateXP();
        };
        checkC.onchange = function() {
          option.burrow = checkC.checked;
          updateXP();
        };
        checkD.onchange = function() {
          option.fly = checkD.checked;
          updateXP();
        };
        checkW.onchange = function() {
          option.up_life = checkW.checked;
          updateXP();
        };
        checkX.onchange = function() {
          option.up_damage = checkX.checked;
          updateXP();
        };
        checkY.onchange = function() {
          option.up_agility = checkY.checked;
          updateXP();
        };
        checkZ.onchange = function() {
          option.up_senses = checkZ.checked;
          updateXP();
        };
        selectorP.onchange = function() {
          option.neg_life = selectorP.value;
          updateXP();
        };
        selectorQ.onchange = function() {
          option.neg_damage = selectorQ.value;
          updateXP();
        };
        selectorR.onchange = function() {
          option.neg_agility = selectorR.value;
          updateXP();
        };
        selectorS.onchange = function() {
          option.neg_senses = selectorS.value;
          updateXP();
        };

        break;
    }

    updateXP();
  };

  kind.value = option.kind;

  switch (option.kind) {
    case 'Blink':
    case 'Undying Fortitude':
    case 'Critical Attack':
      kind.onchange();
      break;
    case 'Assassin':
    case 'Dedicated Healer': {
      let upgraded = option.upgraded;
      kind.onchange();
      selector1.checked = upgraded;
      option.upgraded = upgraded;
      break;
    }
    case 'Wide Barrage': {
      let range = option.range;
      kind.onchange();
      selector1.value = range;
      option.range = range;
      break;
    }
    case 'Additional Defend Actions':
    case 'Additional Main Actions':
    case 'Action Carryover': {
      let count = option.count;
      kind.onchange();
      number4.value = count;
      option.count = count;
      break;
    }
    case 'Transformation': {
      let uses = option.uses;
      let count = option.count;
      let keep = option.keep;
      let swim = option.swim;
      let climb = option.climb;
      let burrow = option.burrow;
      let fly = option.fly;
      let up_life = option.up_life;
      let up_damage = option.up_damage;
      let up_agility = option.up_agility;
      let up_senses = option.up_senses;
      let neg_life = option.neg_life;
      let neg_damage = option.neg_damage;
      let neg_agility = option.neg_agility;
      let neg_senses = option.neg_senses;

      kind.onchange();

      selector1.value = uses;
      option.uses = uses;

      selector2.value = count;
      option.count = count;

      check3.checked = keep;
      option.keep = keep;

      checkA.checked = swim;
      option.swim = swim;

      checkB.checked = climb;
      option.climb = climb;

      checkC.checked = burrow;
      option.burrow = burrow;

      checkD.checked = fly;
      option.fly = fly;

      checkW.checked = up_life;
      option.up_life = up_life;

      checkX.checked = up_damage;
      option.up_damage = up_damage;

      checkY.checked = up_agility;
      option.up_agility = up_agility;

      checkZ.checked = up_senses;
      option.up_senses = up_senses;

      selectorP.value = neg_life;
      option.neg_life = neg_life;

      selectorQ.value = neg_damage;
      option.neg_damage = neg_damage;

      selectorR.value = neg_agility;
      option.neg_agility = neg_agility;

      selectorS.value = neg_senses;
      option.neg_senses = neg_senses;
      break;
    }
  }

  option.div = div;
  return option;
}

function addAdvanced() {
  let option = new_advanced();
  advanced.push(option);
  document.getElementById('advanced').append(option.div);
  updateXP();
}

function deleteAdvanced(option) {
  let idx = advanced.indexOf(option);
  advanced.splice(idx, 1);
  option.div.remove();

  updateAdvancedCombatStyles();
  updateXP();
}

function updateAdvancedCombatStyles() {
  offensive_styles = ["Melee", "Ranged", "Simple & Weak", "Complex & Powerful"];
  defensive_styles = ["Evasive", "Armored", "Shielded", "Riposte"];

  let assassin = false;
  let blink = false;
  let undying = false;

  for (const option of advanced) {
    switch (option.kind) {
      case 'Assassin':
        assassin = true;
        break;
      case 'Blink':
        blink = true;
        break;
      case 'Undying Fortitude':
        undying = true;
        break;
    }
  }

  if (assassin) { offensive_styles.push('Assassin'); }
  if (blink)    { defensive_styles.push('Blink'); }
  if (undying)  { defensive_styles.push('Undying Fortitude'); }

  advancedCombatStylesChanged();
}

function advancedXP() {
  var xp = 0;

  var n_main = 1;
  var n_defend = 1;
  var n_carryover = 0;
  
  for (const option of advanced) {
    switch (option.kind) {
      case 'Assassin':
        xp += 5;
        xp += option.upgraded ? 4 : 0;
        break;
      case 'Blink':
        xp += 8;
        break;
      case 'Undying Fortitude':
        xp += 10;
        break;
      case 'Wide Barrage':
        xp += 10;
        xp += option.range == 'in the same vicinity' ? 10 : 0;
        break;
      case 'Critical Attack':
        xp += 10;
        break;
      case 'Dedicated Healer':
        xp += 8;
        xp += option.upgraded ? 5 : 0;
        break;
      case 'Additional Defend Actions':
        n_defend += option.count;
        break;
      case 'Additional Main Actions':
        n_main += option.count;
        break;
      case 'Action Carryover':
        n_carryover += option.count;
        break;
      case 'Transformation':
        xp += 10;
        switch (option.uses) {
          case 'five times per session out of combat':
            xp += 5;
            break;
          case 'unlimited times outside of combat':
            xp += 10;
            break;
        }
        xp += option.keep ? 4 : 0;
        xp += option.swim ? 2 : 0;
        xp += option.climb ? 2 : 0;
        xp += option.burrow ? 2 : 0;
        xp += option.fly ? 2 : 0;
        switch (option.count) {
          case '2 options':
            xp += 5;
            break;
          case '3 options':
            xp += 12;
            break;
          case '4 options':
            xp += 20;
            break;
        }
        xp += option.up_life ? 5 : 0;
        xp += option.up_damage ? 5 : 0;
        xp += option.up_agility ? 5 : 0;
        xp += option.up_senses ? 5 : 0;

        function option_neg_xp(v) {
          switch (v) {
            case 'full':
              return 0;
            case 'reduced':
              return 4;
            case 'none':
              return 8;
          }
        }

        xp += option_neg_xp(option.neg_life);
        xp += option_neg_xp(option.neg_damage);
        xp += option_neg_xp(option.neg_agility);
        xp += option_neg_xp(option.neg_senses);

        break;
    }
  }

  xp += 8 * (n_defend * (n_defend + 1) / 2 - 1);
  xp += 10 * (n_main * (n_main + 1) / 2 - 1);
  xp += 5 * (n_carryover * (n_carryover + 1) / 2);

  return xp;
}
