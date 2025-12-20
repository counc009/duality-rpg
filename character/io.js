function dump() {
  let name = document.getElementById('name').value;

  let data = {
    in_create_mode: creation_mode,
    name: name,
    stats: statistics,
    attrs: attributes,
    speed: speeds,
    specs: specializations,
    exprs: experiences,
    abils: abilities,
    offns: offensives,
    defns: defensives,
    items: items,
  };

  let json = JSON.stringify(data, (key, value) => (key == 'div' ? undefined : value));

  const link = document.createElement('a');
  const file = new Blob([json], { type: 'application/json' });
  link.href = URL.createObjectURL(file);
  link.download = name + '.json';
  link.click();
  URL.revokeObjectURL(link.href);
}

const pickerOpts = {
  types: [
    {
      description: "Characters",
      accept: {
        'json/*': ['.json'],
      },
    }
  ],
  excludeAcceptAllOption: true,
  multiple: false,
};

async function load() {
  let input = document.getElementById('load');
  let files = input.files;
  let file = files[0];
  let text = await file.text();

  let data = JSON.parse(text);
  console.log(data);

  creation_mode = data.in_create_mode;
  document.getElementById('mode').checked = data.in_create_mode;

  document.getElementById('name').value = data.name;

  statistics = data.stats;
  document.getElementById('strength').value = data.stats.strength;
  document.getElementById('finesse').value = data.stats.finesse;
  document.getElementById('willpower').value = data.stats.willpower;
  document.getElementById('instinct').value = data.stats.instinct;
  document.getElementById('presence').value = data.stats.presence;
  document.getElementById('knowledge').value = data.stats.knowledge;

  attributes = data.attrs;
  document.getElementById('life').value = data.attrs.life;
  document.getElementById('recovery').value = data.attrs.recovery;
  document.getElementById('block').value = data.attrs.block;
  document.getElementById('wealth').value = data.attrs.wealth;

  speeds = data.speed;
  document.getElementById('walk').value = data.speed.walk;
  document.getElementById('climb').value = data.speed.climb;
  document.getElementById('swim').value = data.speed.swim;
  document.getElementById('burrow').value = data.speed.burrow;
  document.getElementById('fly').value = data.speed.fly;

  // TODO: handle specializations, experiences, abilities, combat styles, and items

  input.value = '';
  updateXP();
}
