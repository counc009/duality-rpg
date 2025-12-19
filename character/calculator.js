var statistics = { strength: 0, finesse: 0, willpower: 0, instinct: 0, presence: 0, knowledge: 0 };
var attributes = { life: 20, recovery: 10, block: 0, wealth: 'None' };
var speeds = { walk: 'Normal', climb: 'N/A', swin: 'N/A', burrow: 'N/A', fly: 'N/A' };

var creation_mode = true;

function modeChange() {
  creation_mode = document.getElementById('mode').checked;

  // If we switched to character creation mode, make sure everything is in range
  if (creation_mode) {
    updateStat(document.getElementById('strength'));
    updateStat(document.getElementById('finesse'));
    updateStat(document.getElementById('willpower'));
    updateStat(document.getElementById('instinct'));
    updateStat(document.getElementById('presence'));
    updateStat(document.getElementById('knowledge'));

    updateAttr(document.getElementById('life'));
    updateAttr(document.getElementById('recovery'));
    updateAttr(document.getElementById('block'));

    updateXP();
  }
}

function updateStat(src) {
  let val = parseInt(src.value);

  if (val == NaN) {
    val = statistics[src.id];
  } else if (val < -1) {
    val = -1;
  } else if (val > 2 && creation_mode) {
    val = 2;
  } else if (val > 3) {
    val = 3;
  }

  statistics[src.id] = val;
  src.value = val;
}

function statChange(evnt) {
  updateStat(evnt.srcElement);
  updateXP();
}

function updateAttr(src) {
  switch (src.id) {
    case 'life':
      var val = parseInt(src.value);

      if (val == NaN) {
        val = attributes.life;
      } else if (val < 1) {
        val = 1;
      } else if (val > 40 && creation_mode) {
        val = 40;
      }

      attributes.life = val;
      src.value = val;
      break;
    case 'recovery':
      var val = parseInt(src.value);

      if (val == NaN) {
        val = attributes.recovery;
      } else if (val < 1) {
        val = 1;
      } else if (val > 20 && creation_mode) {
        val = 20;
      }

      attributes.recovery = val;
      src.value = val;
      break;
    case 'block':
      var val = parseInt(src.value);

      if (val == NaN) {
        val = attributes.block;
      } else if (val < 0) {
        val = 0;
      } else if (val > 2 && creation_mode) {
        val = 2;
      } else if (val > 5) {
        val = 5;
      }

      attributes.block = val;
      src.value = val;
      break;
    case 'wealth':
      attributes.wealth = src.value;
      break;
  }
}

function attrChange(evnt) {
  updateAttr(evnt.srcElement);
  updateXP();
}

function speedChange(evnt) {
  let src = evnt.srcElement;
  speeds[src.id] = src.value;
  updateXP();
}

function updateXP() {
  var xp = 0;
  
  // Calculate XP of basic statistics
  let statXP = function(n) { switch (n) { case -1: return -3; case 0: return 0; case 1: return 3; case 2: return 9; case 3: return 18; }};
  xp += statXP(statistics.strength);
  xp += statXP(statistics.finesse);
  xp += statXP(statistics.willpower);
  xp += statXP(statistics.instinct);
  xp += statXP(statistics.presence);
  xp += statXP(statistics.knowledge);

  // TODO: everything else

  document.getElementById('xp').textContent = xp;
}
