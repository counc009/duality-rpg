# Development To-Do List
Version 0.4.0 will be a major rebalance of the game; the current ideas for this rebalance are
- [ ] Rebalancing weapon damage (likely some limit as well as an XP price increase)
  + Have a damage die for the offensive style like current (d8 melee, d6 ranged, d4 simple & weak, d10 complex & powerful) with an option for like 5 XP to increase the die one size
  + Separately, weapons can add additional damage, 5 XP for a d4, 15 XP (10 XP more than d4) for a d6, 30 XP for a d8, 50 XP for a d10, and 75 XP for a d12
- [ ] Modifying combat to one roll rather than an attack and defend roll
  + For a PC attacking an NPC
    1. The NPC determines whether to take a Defend Action, which may impact the PC's difficulty of hitting them or granting the NPC some other benefit.
    2. The PC rolls against the NPC's difficulty and determines what happens based on the outcome
       1. Very Bad: The GM gains an Advantage. If the NPC took a Defend Action, and can reasonably do so, they can deal damage to the PC and otherwise the GM gains another Advantage.
       1. Bad: If the NPC took a Defend Action, and can reasonably do so, they can deal damage to the PC and otherwise the GM gains an Advantage.
       1. Mixed: The PC deals damage to the target. If the NPC took a Defend Action, and can reasonably do so, they can deal damage to the PC and otherwise the GM gains an Advantage.
       1. Good: The PC deals damage to the target.
       1. Very Good: The PC gains an Advantage and deals damage to the target.
  + For an NPC attacking a PC
    1. The PC decides whether or not to take a Defend Action.
       1. If not, the NPC automatically hits and deals damage to the PC.
       1. If the PC does take a Defend Action they rolls against a difficulty to avoid the hit (with the difficulty determined by the NPC's statistics), and determines what happens based on the outcome
          1. Very Bad: The GM gains an Advantage and the NPC deals damage.
          1. Bad: The NPC deals damage.
          1. Mixed: The NPC deals damage. If the PC reasonably can, they can deal damage to the NPC or instead gain an Advantage.
          1. Good: If the PC reasonably can, they can deal damage to the NPC or instead gain an Advantage.
          1. Very Good: The PC gains an Advantage and, if they reasonably can, they can deal damage to the NPC or instead gain an additional Advantage.
- [ ] Introduction of some action economy that limits number of attacks/defends per turn
  + Default 1 Attack Action and 1 Defend Action
  + Attach Actions can be used to Defend but not vice-versa
  + XP is probably around 8n for an additional Defend and 10n for an additional Attack
  + Maybe you can save unused actions between rounds, or there's a character option that lets you
    * This creates possibilities for enemies to collect actions to activate more powerful attacks as combat progresses
  + Defensive styles define what benefit you get on a Defend Action
    * Evasive decreases your difficulty to avoid the hit by your selected statistic
    * Armored means that anytime you are targeted you get to roll to avoid the hit even if you don't spend a Defend Action (though the difficulty is increased by 1 level, basically a -3 penalty), but you cannot hit back or gain Advantage from it unless you use a Defend Action
    * Shielded grants you block equal to your selected statistic
    * Riposte causes the attacker (if they are within range) to take damage equal to your selected statistic regardless of the outcome
- [ ] Potentially uses of action economy for different stronger attacks
  + Spend two Attack Actions on one attack so opponent has to use two Defend Actions to defend
  + Can spend an Attack Action to gain two Advantage
  + Can spend two Attack Actions to target a group that are all clumped together (probably all within melee range of each other)
  + Can spend two Attack Actions to take an attack with Advanced attack options
- ~~[ ] Potentially modifying combat to use the attack roll result to determine damage~~
- [ ] Add rules for travel (or a more general progress system)
- [ ] Potentially add advanced character options which you have to spend XP to unlock before you can gain (and the GM must approve)
  + [ ] **Blink**: advanced defensive style, when you use a Defend Action to activate it you can teleport a certain distance and avoid damage (maybe some additional restriction as otherwise this is very strong)
    * For a player to take this they may have to get GM approval and then describe, for example, the place they travel through in between and how they avoid the madness it causes
  + Advanced Attack Options (can acquire multiple and choose per attack which to use; or you spend an action for each you want to activate; essentially designed to give us mechanics for dragon breath)
    * [ ] Multiple Targets at increased ranged
    * [ ] Additional Damage
