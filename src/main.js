var roleHarvester = require('creeps_roles_harvester');
var roleUpgrader = require('creeps_roles_upgrader');
var roleBuilder = require('creeps_roles_builder');
var roleRepairer = require('creeps_roles_repairer');
const { filter } = require('lodash');

module.exports.loop = function () {
    // Memory management
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // Maintain constant workforce
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');

    // Lower level room controller can only make basic creeps
    if(!Game.spawns['Spawn1'].spawning){
        if(harvesters.length < 4){
            var newName = 'Harvester' + Game.time;
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], newName, {memory: {role: 'harvester'}});
        }
        else if(upgraders.length < 4){
            var newName = 'Upgrader' + Game.time;
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], newName, {memory: {role: 'upgrader'}});
        }
        else if(builders.length < 4){
            var newName = 'Builder' + Game.time;
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], newName, {memory: {role: 'builder'}});
        }
        else if(repairers.length < 1){
            var newName = 'Repairer' + Game.time;
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], newName, {memory: {role: 'repairer'}});
        }
    }
    else{     
        // Display name of screep being spawned
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x+1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }

    /**
     * The main loop takes a list of all available creeps and performs an
     * action based on their roles and context. Using the assigned role values
     * from their memory we can apply different actions to otherwise identical
     * creeps.
     * */
     for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
    }
}