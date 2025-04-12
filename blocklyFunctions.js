const javascriptGenerator = Blockly.JavaScript;

// Configuração dos blocos Blockly
Blockly.Blocks['move_forward'] = {
  init: function () {
    this.appendDummyInput().appendField("Avance");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
  }
};

Blockly.Blocks['turn_right'] = {
  init: function () {
    this.appendDummyInput().appendField("Vire à direita ↷");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
  }
};

Blockly.Blocks['turn_left'] = {
  init: function () {
    this.appendDummyInput().appendField("Vire à esquerda ↶");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
  }
};

Blockly.Blocks['repeat_times'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("repita 🔄")
      .appendField(new Blockly.FieldDropdown([
        ["1", "1"],
        ["2", "2"],
        ["3", "3"],
        ["4", "4"],
        ["5", "5"],
        ["6", "6"],
        ["7", "7"],
        ["8", "8"],
        ["9", "9"],
        ["10", "10"]
      ]), "TIMES")
      .appendField("vezes");
    this.appendStatementInput("DO")
      .setCheck(null)
      .appendField("faça");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
  }
};


// Geradores de código JavaScript para os blocos
javascriptGenerator.forBlock['move_forward'] = function () {
  return `"forward",`;
};

javascriptGenerator.forBlock['turn_right'] = function () {
  return `"right",`;
};

javascriptGenerator.forBlock['turn_left'] = function () {
  return `"left",`;
};

javascriptGenerator.forBlock['repeat_times'] = function (block) {
  const times = parseInt(block.getFieldValue('TIMES')); // 👈 conversão importante
  const branch = javascriptGenerator.statementToCode(block, 'DO').trim();
  const cleanBranch = branch.replace(/,+$/, '');
  const repeated = Array(times).fill(cleanBranch).join(',');
  return repeated + ',';
};



// Injeta Blockly no HTML
var workspace = Blockly.inject('blocklyDiv', {
  toolbox: document.getElementById('toolbox')
});

function runProgram() {
  let code = javascriptGenerator.workspaceToCode(workspace);


  code = `[${code.trim().replace(/,+$/, '')}]`;

  console.log("Código gerado:", code);

  let commands;
  try {
    commands = eval(code);
  } catch (err) {
    console.error("Erro ao interpretar código gerado:", err);
    return;
  }

  const json = JSON.stringify({ items: commands });


  console.log("JSON enviado para Unity:", json);
  
  if (typeof gameInstance !== "undefined") {
    gameInstance.SendMessage('Connector', 'ReceiveCommands', json);
  } else {
    console.error("gameInstance não está definido.");
  }
  
}

function resetPosition() {
  if (typeof gameInstance !== "undefined") {
    gameInstance.SendMessage('Connector', 'ResetPlayer', '');  
  } else {
    console.error("gameInstance não está definido.");
  }
}

