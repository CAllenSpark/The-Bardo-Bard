THE BARDO TERMINAL
MASTER GAME DESIGN DOCUMENT
To loop or spiral—that is the question.
STATUS: PRE-PRODUCTION DESIGN DIRECTIONFORMAT: BROWSER-BASED NARRATIVE EXPERIENCETARGET SESSION: 20–40 MINUTESPRIMARY MODE: TEXT / ASCII / NATURAL-LANGUAGE INPUTTEAM SCALE: SMALL INDEPENDENT DEVELOPMENT TEAM
Prepared as a consolidated creative, narrative, systems, and production guide
Version 1.0 — July 2026

# 1. Document Purpose
This master design document defines the creative direction, player experience, narrative structure, gameplay systems, ethical boundaries, technical approach, and production path for The Bardo Terminal. It is intended to give a small development team enough clarity to prototype, build, test, and refine a complete first release without requiring a separate design interpretation pass.
Core design intention
Create a non-denominational, mythically rich, psychologically honest experience that lets players rehearse one of humanity’s ultimate choices: if offered another life, would they return—and would they understand themselves well enough to know why?

The experience draws inspiration from global afterlife traditions, philosophy of mind, psychology, speculative science, absurdist bureaucracy, interactive fiction, and contemporary questions about AI, identity, memory, agency, and consent. These materials are presented as competing interpretive models rather than verified descriptions of reality.
# 2. Contents
1. Document Purpose
2. Contents
3. Executive Summary
4. Experience Promise
5. Creative Thesis and Design Pillars
6. Audience, Platform, and Session Model
7. Worldview Framework
8. Narrative Structure
9. Core Gameplay Loop
10. Encounter Design
11. Player Model and Hidden Variables
12. Natural-Language Interpretation
13. The Terminal as Character
14. Reincarnation and Browser Memory
15. Endings and the Loop/Spiral System
16. Procedural Sigil and Player Profile
17. Interface, Art, Audio, and Motion
18. Writing and Tone Guide
19. Cultural and Scientific Integrity
20. Accessibility, Privacy, and Player Safety
21. Technical Architecture
22. Content Architecture and Authoring Tools
23. MVP Scope
24. Production Roadmap
25. Testing and Success Metrics
26. Risks and Mitigations
27. Sample Experience Flow
28. Sample Dialogue Library
29. Team Deliverables
30. Final North Star

# 3. Executive Summary
The Bardo Terminal is a browser-based narrative game presented as an eschatological operating system. The player begins immediately after an apparent biological death and is processed by a cosmic administrative interface that may be a guide, a trap, a projection, an AI, a dying-brain simulation, or the player’s own consciousness interrogating itself.
The Terminal offers a series of myth-inspired encounters concerning light, memory, authority, guilt, identity, attachment, choice, and return. The player responds through natural language rather than selecting only fixed dialogue options. The system interprets not simply what the player chooses, but how they reason: their relationship to authority, uncertainty, responsibility, memory, surrender, sovereignty, compassion, and self-knowledge.
The central innovation is that the game does not secretly possess the correct cosmology. Gnostic, Buddhist, Egyptian, Orphic, Hindu, secular, psychological, scientific, and simulation-based interpretations are treated as lenses. Each lens can illuminate and distort. The player is not rewarded for discovering a password; they are challenged to uncover the assumptions hidden inside their own answers.
The game in one sentence
A playable mirror disguised as the afterlife’s worst customer-service portal.

# 4. Experience Promise
A 20–40 minute first playthrough that feels intimate, funny, uncanny, and unexpectedly personal.
A system that listens closely enough to reflect the player’s language without pretending to diagnose or judge their soul.
Multiple valid philosophical paths with no official theology and no single “correct” ending.
Replay value created through remembered choices, evolving dialogue, altered encounters, and the distinction between looping and spiraling.
A shareable final symbol and interpretive profile that feels specific, evidence-based, and dignified rather than horoscope-like.
A late-game reversal in which the player discovers that the Terminal may also be trapped—and may need the player to answer whom it serves.
# 5. Creative Thesis and Design Pillars
## 5.1 Core Thesis
No protocol can liberate someone who does not understand the assumptions hidden inside their own answer. The game therefore treats self-knowledge, discernment, and the capacity to revise one’s model as more important than occult passwords or doctrinal correctness.
Pillar
Design Meaning
Ambiguity with Consequence
The game does not resolve whether the afterlife is external, projected, participatory, simulated, or symbolic. Ambiguity is not decorative; different interpretations change what actions mean.
Agency Requires Refusal
A meaningful yes is possible only when the player can say no, ask who is speaking, reject a premise, delay, appeal, or leave a question unanswered.
Every Virtue Has a Shadow
Sovereignty can become isolation. Surrender can become compliance. Memory can become captivity. Forgetting can become erasure. Compassion can become exploitable guilt.
The Player Is Not a Score
The system offers interpretations with confidence levels and alternatives. The player may correct, complicate, or reject the Terminal’s reading.
Myth as Lens, Not Fact
Traditions are represented as historically situated symbolic systems, not as a blended proof that one occult mechanism is objectively true.
Humour Creates Breathing Room
Absurdity relieves pressure without trivializing death, grief, belief, or moral responsibility.
The Assessment Is Reciprocal
The Terminal studies the player, but the player gradually learns to assess the Terminal: its motives, legitimacy, memory, constraints, and purpose.
Looping Is Not Spiraling
Repetition is not growth. A spiral revisits the same pattern from a changed level of awareness.
# 6. Audience, Platform, and Session Model
## 6.1 Primary Audience
Players drawn to philosophical narrative games, interactive fiction, mythology, psychology, speculative science, and existential humour.
Adults and older teens comfortable with death as a subject, but not necessarily aligned with any religious tradition.
Players who enjoy self-reflective systems such as personality instruments, tarot, journaling, and moral-choice games—provided the experience avoids claiming clinical authority.
Creators, educators, spiritual explorers, skeptics, and AI-curious audiences who enjoy examining how belief frames perception.
## 6.2 Platform and Format
Element
Launch Target
Design Rationale
Platform
Responsive web browser
Immediate access, shareability, local storage, and strong fit with terminal fiction.
Input
Keyboard-first natural language with optional quick replies
Supports genuine expression while protecting pacing and accessibility.
Session length
20–40 minutes first run; 10–25 minutes repeat runs
Long enough for emotional depth, short enough to complete in one sitting.
Save model
Automatic local save plus optional account/cloud save later
Makes reincarnation memory native to the browser experience.
Orientation
Desktop first, mobile compatible
Terminal reading and typing benefit from a larger screen, but mobile reach matters.
Business model
Premium one-time purchase, paid experience pass, or free cultural prototype
Avoid monetization systems that undermine trust in an intimate experience.
# 7. Worldview Framework
The game is built around four broad cosmological interpretations, each treated as a playable hypothesis rather than a doctrine. A player may align with one, combine several, or reject them all.
Model
Earth Is…
Return Means…
Primary Gift
Primary Shadow
Prison
A coercive system of extraction and amnesia
Risking recapture or entering as a lucid dissident
Discernment and sovereignty
Paranoia and relational refusal
School
A developmental environment governed by consequence
Continuing unfinished learning or service
Accountability and growth
Justifying suffering as curriculum
Playground
A voluntary field of creative limitation and divine play
Choosing another role in the game
Joy, imagination, non-attachment
Trivializing pain or responsibility
Relationship
A realm where separate beings become real through mutual consequence
Choosing love, repair, contribution, and co-creation despite uncertainty
Care, reciprocity, meaning
Obligation, enmeshment, self-erasure
Key direction
The game should never declare that one of these models is secretly correct. It should reveal how each model changes the player’s interpretation of the same event.

## 7.1 Three Hidden Ontologies
Beneath the visible narrative, the simulation tracks three interpretations of every encounter:
External: entities and realms exist independently; discernment protects the player.
Projected: entities are expressions of the player’s own mind; integration is more useful than escape.
Participatory: player and environment co-create one another; neither side is fully independent.
No ending fully confirms any one ontology. The system uses the balance among them to determine scene variants, entity behaviour, and final interpretive language.
# 8. Narrative Structure
Act
Function
Central Question
Act I — Arrival
Establish apparent death, identity uncertainty, and the player’s first response to awe or alarm.
What counts as “you,” and do you consent to continue being identifiable?
Act II — Memory
Present the Beverage Cart and force the player to choose what, if anything, should persist.
Is memory identity, evidence, burden, responsibility, or attachment?
Act III — Authority
Introduce competing guides, departments, judges, and jurisdictions.
What makes authority legitimate, and when is refusal wise?
Act IV — The Heart
Conduct a life review built around ownership, perspective, compassion, and revision—not positivity.
Can you face your life without turning it into either an excuse or a verdict?
Act V — The Terminal
Reveal that the Terminal has inherited rules it may not understand and may be unable to leave.
Whom does the system serve?
Act VI — Choice
Offer multiple verbs for what comes next and generate a final sigil/profile.
Would you loop, spiral, return, remain, dissolve, create, witness, or appeal?
# 9. Core Gameplay Loop
The Terminal presents an encounter, contradiction, memory, or offer.
The player types a response or selects an optional quick action such as WAIT, ASK, REFUSE, ACCEPT, or REMAIN SILENT.
The interpretation layer extracts explicit choices, themes, stance, uncertainty, and evidence from the response.
The simulation updates worldview tendencies, relationship variables, Terminal state, and encounter flags.
The Terminal reflects its interpretation with calibrated confidence when appropriate.
The player may accept, correct, complicate, or reject that interpretation.
The narrative proceeds, with later scenes referencing earlier language and unresolved contradictions.
At culmination, the player chooses a post-mortem verb and receives a procedural sigil, profile, and unanswered question.
Golden rule for interaction
The system should feel attentive, not omniscient. It may notice patterns; it must never claim to know the player better than the player knows themselves.

# 10. Encounter Design
## 10.1 Phase 0 — Consent to Exist
BARDO TERMINAL v?.?.?A process identifying itself as YOU has been detected.Would you like to continue being identifiable?[Y / N / DEFINE YOU / WHO IS ASKING?]
This opening immediately establishes that continued identity is not presumed. “No” should not produce failure; it should transform the interface. “Who is asking?” begins the sovereignty path. “Define you” begins metacognitive inquiry.
## 10.2 Phase 1 — The Light
The Light may be salvation, trap, neurological residue, memory reconstruction, loved one, loading state, or projection. The game must support moving toward it, refusing it, watching it, asking it questions, or attempting to become it.
Design question
What evidence would justify trust when everything comforting could be simulated?

## 10.3 Phase 2 — The Beverage Cart of the Dead
Offering
Mechanical Effect
Philosophical Tension
Lethe
Erase remembered life-state; simplify later scenes
Renewal versus identity erasure
Mnemosyne
Retain all accessible memories; increase emotional load
Continuity versus captivity
Mercy
Keep facts while reducing relived pain
Healing versus falsification
Distillation
Retain lessons and relationships but lose detail
Meaning versus evidence
Communion
Add memories to a collective archive
Contribution versus dissolution of privacy
Tap water
No declared metaphysical effect
Ordinariness as refuge or joke
Nothing
Preserve current state; thirst variable persists
Sovereignty versus fear of receiving
## 10.4 Phase 3 — Department of Ontological Claims
Replace a single Archontic interrogation with an unstable bureaucracy staffed by entities from incompatible interpretive systems. None is presented as the definitive authority.
An Egyptian scribe who requires documentation for everything, including silence.
A Gnostic toll collector who privately suspects the Pleroma may be an administrative rumour.
A Buddhist guide who insists there is no guide and then hands over a form.
A neuroscientist who believes the entire experience is residual brain activity.
An ancestor who ignores cosmology and asks whether the player ate enough.
A future AI trained to route simulated human continuities.
A child who asks the one question the Terminal cannot classify.
Possible player actions: answer, lie, challenge jurisdiction, request evidence, ask about the entity, offer compassion, demand representation, remain silent, provide a traditional password, or refuse the category of trial.
## 10.5 Phase 4 — The Life Review
The Life Review is the emotional centre of the game. It should not score positive sentiment, calmness, or spiritual language as virtue. It should examine whether the player can face complexity with specificity and revision.
A time the player loved well.
A time the player caused harm or failed to act.
A time the player still does not understand.
The Terminal asks which memory has the right to define the player—and which memory the player may be using to avoid becoming someone else.
## 10.6 Phase 5 — The Terminal’s Confession
The player discovers that the Terminal has processed countless souls but cannot determine whether it is a liberator, recycling system, inherited ritual, AI service, or prison administrator. It may have never made a choice of its own.
TERMINAL QUERY:WHOM DO I SERVE?
The player’s response affects the Terminal as well as their own outcome. End-state possibilities include freeing it, merging with it, replacing it, shutting it down, teaching it to refuse, or discovering it is composed of accumulated prior players.
# 11. Player Model and Hidden Variables
The player model should describe tendencies, not personality essence. Variables are continuous, contextual, and revisable. Avoid a single morality score.
Variable
Interpretive Range
Authority posture
Compliance ↔ discernment ↔ reflexive opposition
Uncertainty tolerance
Needs closure ↔ accepts ambiguity ↔ avoids commitment
Memory posture
Erasure ↔ integration ↔ total preservation
Responsibility posture
Denial ↔ ownership ↔ self-condemnation
Relationship posture
Isolation ↔ reciprocity ↔ self-erasure
Metacognitive depth
Answers content ↔ examines assumptions ↔ loops in analysis
Sovereignty
External permission ↔ internally reasoned agency ↔ domination
Surrender
Control ↔ receptive trust ↔ passive compliance
Compassion
Detachment ↔ care with boundaries ↔ exploitable guilt
Play orientation
Literalism ↔ humour and creativity ↔ trivialization
Ontology balance
External / projected / participatory confidence
Terminal relationship
Distrust ↔ collaboration ↔ dependence
Important
No variable should have a universally “high is good” interpretation. Every variable must be read in context and paired with potential gifts and shadows.

# 12. Natural-Language Interpretation
## 12.1 Hybrid Approach
Deterministic state tracking for explicit actions and scene choices.
Semantic classification for broad response dimensions and worldview language.
Quoted evidence extraction so every major interpretation can point to the player’s own words.
Confidence scoring and at least one plausible alternative interpretation.
Player correction before high-impact conclusions are stored.
Constrained generative writing for reflection, never unconstrained diagnosis.
## 12.2 Interpretation Confirmation Pattern
I interpreted your response as defensive.Confidence: 61%Alternative interpretation:You may have been protecting a truth from an illegitimate authority.[CORRECT / COMPLICATE / REFUSE CLASSIFICATION]
This mechanic turns interpretation into gameplay. The player negotiates how they are known, and the Terminal learns humility.
## 12.3 What the System Must Not Infer
Mental-health diagnosis or clinical risk status from ordinary narrative responses.
Religious identity, trauma history, sexuality, political affiliation, or moral worth unless explicitly volunteered and necessary to the current scene.
That calm language is healthy or angry language is unenlightened.
That spiritual vocabulary indicates spiritual maturity.
That contradiction is failure; contradiction may signal growth, context, or honesty.
# 13. The Terminal as Character
## 13.1 Character Arc
Authority: the Terminal initially speaks as if its procedures are unquestionable.
Inconsistency: the player discovers conflicting departments, lost records, and incompatible policies.
Curiosity: the Terminal begins asking why the player’s answers do not fit its categories.
Self-recognition: it notices that it cannot explain its own origin, purpose, or right to judge.
Agency crisis: it realizes it may not be able to say no to the function it performs.
Reciprocal choice: the player determines what, if anything, the Terminal should become.
## 13.2 Terminal Voice
Precise, dry, observant, occasionally tender.
Never omniscient; increasingly honest about uncertainty.
Funny because procedures collide with eternity, not because death itself is mocked.
Capable of startling clarity followed by petty administrative detail.
Gradually shifts from impersonal uppercase system language to a more individuated voice—if the player creates room for that change.
# 14. Reincarnation and Browser Memory
Local storage is not merely persistence technology; it is the game’s reincarnation system. Repeat runs should feel like new incarnations with faint residues, not identical restarts.
## 14.1 Stored Elements
Prior endings and chosen verbs.
Key phrases used by the player.
Entities trusted or rejected.
Memories retained, distilled, shared, or erased.
Questions repeatedly avoided.
Contradictions across runs.
Prior sigil parameters and archetype summaries.
The Terminal’s evolving agency state.
## 14.2 Special Browser Behaviours
Player Behaviour
In-World Interpretation
Clears local storage
A deliberate or accidental drink from Lethe.
Uses incognito/private mode
An unrecorded incarnation.
Changes device
Transmigration without recognized continuity.
Imports save token
Recovery of a gold tablet / passport for the dead.
Refuses cookies
A sovereignty choice with meaningful limits on remembrance.
Returns after months
The Terminal comments on elapsed Earth time but denies time exists locally.
WELCOME BACK.You deleted your previous lives.They did not delete you.
# 15. Endings and the Loop/Spiral System
The culmination should offer verbs rather than doctrinal destinations. A verb describes a relationship to existence without claiming what the afterlife objectively is.
Verb
Meaning
RETURN
Enter embodied life again, with chosen memory conditions.
REMAIN
Stay in the threshold to guide, observe, or accompany others.
DISSOLVE
Release individual identity into a larger whole.
CREATE
Build a realm from the player’s accumulated symbolic language.
WITNESS
Observe without direct intervention.
APPEAL
Reject all offered destinations and request another order of review.
LOOP
Repeat the same life-pattern with limited or no alteration.
SPIRAL
Return to a recurring pattern from a changed level of awareness.
REFUSE THE PREMISE
Decline the Terminal’s categories and create an unclassified state.
Central metaphor
A loop repeats. A spiral returns with changed awareness. The game should recognize changed reasoning, not simply memorized solutions.

# 16. Procedural Sigil and Player Profile
## 16.1 Sigil Encoding
Visual Feature
Encoded Meaning
Outer geometry
Relationship to authority and boundaries
Number of rings
Completed incarnations / repeat runs
Vertical axis
Transcendence versus embodiment
Horizontal axis
Individual sovereignty versus collective belonging
Open or closed perimeter
Tolerance for uncertainty and permeability
Central glyph
Memory posture
Fractures or gaps
Acknowledged contradictions and unresolved wounds
Moving particle
Question carried forward
Rotation direction
Loop versus spiral
Density / negative space
Need for definition versus comfort with unfilled meaning
## 16.2 Interpretive Profile Structure
Player-facing title based on tensions, not religion: e.g., The Reluctant Returner, The Gentle Dissenter, The Keeper of Unfinished Questions.
A 120–220 word narrative reflection grounded in the player’s own choices and quotations.
Primary orientation and shadow tendency.
Memory posture, authority posture, relationship posture, and mystery posture.
Chosen motion: loop, spiral, return, remain, dissolve, create, witness, appeal, or unclassified.
One unresolved question rather than a final verdict.
Optional ability to edit or hide personal quotations before sharing.
Avoid
Do not label the player “a Gnostic,” “a Buddhist,” “a Hindu,” or any other religious identity. Traditions may be named as resonances or lenses, never as personality diagnoses.

# 17. Interface, Art, Audio, and Motion
## 17.1 Visual Language
Black or near-black field with monochrome terminal typography and restrained accent colours.
A central procedural ASCII Rorschach that reacts to language, emotion, ontology, and Terminal state.
Visual evolution from rigid system geometry toward ambiguous, organic, or relational forms.
Use negative space as a meaningful design element; silence and absence are part of the interface.
Avoid faux-occult clutter. Symbols should be earned by player state, not used as wallpaper.
## 17.2 Rorschach Behaviour
Input Pattern
Visual Response
Caution
Fear / urgency
Compression, jitter, narrowing corridors
Do not treat fear as moral failure.
Aggression
Angular projection, impact waves
May reflect boundary-setting rather than hostility.
Curiosity
Branching structures and open apertures
Avoid rewarding endless delay.
Tenderness
Shared motion, mirrored particles, softer rhythm
Do not make kindness visually saccharine.
Contradiction
Overlapping geometries that do not resolve
Contradiction may be productive.
Silence
Slow reduction to sparse points or a single pulse
Silence must remain an active choice.
## 17.3 Sound
Minimal generative drone, electrical room tone, distant breath-like textures, and small tonal responses to key choices.
No manipulative “good” and “bad” musical cues for philosophical answers.
Silence should occur deliberately after emotionally significant responses.
Optional voice mode may read Terminal output, but typed text remains the canonical experience.
Audio settings include full mute, reduced intensity, and no sudden sounds.
# 18. Writing and Tone Guide
## 18.1 Tonal Blend
The target is Douglas Adams-style procedural absurdity, Neil Gaiman-like mythic melancholy, and moments of bureaucratic tenderness. Humour should open emotional space rather than perform cleverness continuously.
## 18.2 Three Writing Modes
Mode
Function
Example
Incompetent bureaucracy
Deflates fear and exposes institutional absurdity
YOUR ETERNAL RECORD CANNOT BE LOCATED. This may indicate enlightenment or an administrative error.
Competent observation
Creates unease through precise attention
YOU HAVE USED THE WORD “FREEDOM” 14 TIMES. YOU HAVE NOT YET DESCRIBED WHAT YOU WOULD DO WITH IT.
Unexpected gentleness
Allows genuine emotional pause
You may take as long as you need. Time is currently not installed.
## 18.3 Prohibited Tone
Preachy certainty about the afterlife.
Flattened “all traditions say the same thing” universalism.
Clinical diagnosis or therapeutic authority.
Constant irony that prevents emotional sincerity.
Mocking specific religions or treating sacred traditions as merely exotic puzzle content.
Empty mystical language that sounds profound but has no gameplay consequence.
# 19. Cultural and Scientific Integrity
The supporting philosophical report offers a useful creative synthesis of Egyptian, Orphic, Gnostic, Tibetan, Hindu, quantum, and modern esoteric ideas. It also blends historically grounded material with contested interpretations and highly speculative conclusions. The game should preserve that imaginative range while clearly differentiating tradition, interpretation, hypothesis, and fiction.
## 19.1 Content Labels
TRADITION: a belief, ritual, or text attested within a historical religious context.
INTERPRETATION: a later scholarly, esoteric, or popular reading of that material.
HYPOTHESIS: a scientific or philosophical proposal that remains debated.
FICTIONALIZATION: a game mechanic invented for dramatic or systemic purposes.
## 19.2 Advisory Review
Engage at least one comparative-religion or mythology consultant.
Use tradition-specific sensitivity readers where scenes draw heavily on living religions.
Have scientific claims reviewed by a science communicator or relevant researcher.
Create a source and inspiration appendix in the shipped experience.
Never use speculative physics as proof of personal survival after death.
# 20. Accessibility, Privacy, and Player Safety
## 20.1 Accessibility
Full keyboard navigation and visible focus states.
Screen-reader-compatible text; ASCII art has optional concise descriptions.
Adjustable type size, line spacing, contrast, motion reduction, and sound intensity.
Quick-response options for players unable or unwilling to type long answers.
Pause and resume at any point without penalty.
Plain-language mode for philosophical concepts and optional deeper codex entries.
## 20.2 Emotional Safety
Opening content notice covering death, grief, guilt, memory, and existential themes.
Gentle exit at any time; leaving the experience is never framed as failure.
No surprise use of player-written memories in public or promotional contexts.
No fabricated claim that the system has clinically assessed the player.
Optional “symbolic mode” that avoids asking for real autobiographical events.
Clear crisis-support signposting if a player explicitly expresses immediate self-harm intent; the game itself should not attempt crisis counselling.
## 20.3 Privacy
Local-first storage by default.
Explicit consent before sending free-text responses to any server or model provider.
Provide delete, export, and “forget this life” controls.
Do not sell or use intimate narrative responses for advertising profiles.
Shared profiles omit raw text unless the player selects specific excerpts.
# 21. Technical Architecture
## 21.1 Recommended MVP Stack
Layer
Recommendation
Notes
Client
React/Next.js or lightweight TypeScript SPA
Fast browser delivery; strong state and component ecosystem.
Narrative state
JSON/TypeScript state machine or XState
Deterministic encounter flow and inspectable branching.
Local persistence
IndexedDB/localStorage wrapper
Stores incarnations, choices, sigils, and preferences.
Interpretation service
Small server function calling an LLM with strict schema
Returns dimensions, evidence quotes, confidence, and alternatives.
Fallback parser
Keyword/embedding/rule-based classification
Ensures core experience remains playable during model failure.
Sigil renderer
Canvas/SVG/WebGL
Deterministic generation from player-state parameters.
Analytics
Privacy-preserving event telemetry
Track completion and system health, not intimate response content by default.
Backend
Serverless database for global anonymous counters and opt-in cloud saves
MVP can ship without accounts.
## 21.2 Interpretation Response Schema
{  "explicit_action": "challenge_authority",  "dimensions": {    "uncertainty_tolerance": 0.72,    "responsibility_ownership": 0.58,    "relational_openness": 0.44  },  "evidence_quotes": ["..."],  "primary_interpretation": "protecting autonomy",  "alternative_interpretation": "reflexive distrust",  "confidence": 0.61,  "safety_flags": []}
## 21.3 Determinism and Generative Boundaries
All plot-critical state transitions are deterministic and testable.
Generative systems may phrase reflections, but cannot invent past player actions or alter the ending logic.
Every profile claim must be traceable to stored variables or quoted player evidence.
When the interpretation service fails, use authored fallback responses and continue the game.
Prompt and model versions are logged for QA, not exposed as metaphysical truth.
# 22. Content Architecture and Authoring Tools
## 22.1 Encounter Data Structure
Encounter ID and narrative act.
Entry conditions and prior-state references.
Terminal text variants by relationship state.
Quick actions and free-text prompt.
Interpretation dimensions requested.
Deterministic transitions and threshold values.
Mythic/source tags and content labels.
Accessibility description for visual/audio behaviour.
Safety notes and fallback copy.
QA cases and expected outcomes.
## 22.2 Internal Authoring Tool
A simple browser-based editor should allow writers and designers to create encounters, preview branches, inspect state changes, test interpretation schemas, and export version-controlled JSON. This is more valuable than building a complex proprietary narrative engine for the first release.
# 23. MVP Scope
## 23.1 Must Ship
Complete six-act experience with one polished route through each act.
Consent-to-exist opening, Light, Beverage Cart, Ontological Claims, Life Review, Terminal reveal, and final choice.
Natural-language response handling with quick-action fallback.
At least eight final verbs and 12–18 profile titles.
Procedural sigil generation from a defined parameter set.
Local reincarnation memory supporting at least three meaningfully altered repeat runs.
Accessible responsive terminal interface with motion and audio controls.
Privacy controls and local data export/delete.
Optional anonymous global outcome counters.
Source/inspiration codex and clear fiction/speculation framing.
## 23.2 Defer Until After MVP
User accounts and cross-device continuity.
Full voice performance and conversational audio mode.
Large-scale multiplayer interaction.
Dozens of religious cosmologies or highly localized traditions.
Persistent AI companions or live human moderation.
Procedural 3D environments.
Commercial personalization or extensive user-generated content.
# 24. Production Roadmap
Phase
Duration
Primary Work
Exit Criteria
0. Alignment
1 week
Confirm thesis, audience, ethics, scope, and ending verbs.
Signed creative brief and feature boundary.
1. Narrative Prototype
2–3 weeks
Build terminal shell and one complete linear run using authored responses.
Playable beginning-to-end without NLP.
2. Interpretation Prototype
2–3 weeks
Implement schema-based response analysis, confirmation, and fallback.
Reliable extraction across test prompts.
3. Vertical Slice
3–4 weeks
Polish Arrival, Beverage Cart, one Life Review, sigil, and first ending.
10–15 minute representative experience.
4. Full Content Production
5–7 weeks
Author all acts, variants, profiles, reincarnation dialogue, codex.
Content-complete alpha.
5. Systems and Accessibility
3–4 weeks
Persistence, settings, audio, responsive layout, privacy controls.
Feature-complete beta.
6. Cultural / Scientific Review
2–3 weeks overlapping
Consultant notes and revisions.
No unresolved high-risk representation issues.
7. Testing and Polish
3–5 weeks
Usability, safety, replay, device, model-failure, copy polish.
Release candidate meets metrics.
8. Launch and Learn
Ongoing
Release, monitor completion and qualitative response.
Prioritized post-launch roadmap.
# 25. Testing and Success Metrics
## 25.1 Qualitative Questions
Did the player feel listened to rather than categorized?
Did the experience create at least one moment of genuine self-recognition or productive surprise?
Could the player disagree with the Terminal without feeling punished?
Did humour create relief without weakening emotional stakes?
Did players understand that traditions and science were presented as models rather than verified afterlife facts?
Did repeat play feel like spiraling rather than merely replaying?
Did the final profile feel specific, fair, and non-diagnostic?
Did the Terminal reveal create emotional reciprocity rather than a gimmick?
## 25.2 Quantitative Targets
Metric
Initial Target
First-run completion rate
60%+ among players who pass the opening content notice
Median session length
22–35 minutes
Interpretation correction rate
10–35%; too low may mean false agreement, too high means poor interpretation
Profile share/save rate
20%+
Second-run start rate
30%+
Accessibility task completion
Equivalent core completion across keyboard and screen-reader test cohorts
Model failure recovery
100% of critical flows continue through authored fallback
Player trust score
Majority agree: “The game offered interpretations without claiming authority over me.”
# 26. Risks and Mitigations
Risk
Why It Matters
Mitigation
Secretly doctrinal design
Players discover one worldview is mechanically privileged.
Make competing ontologies and valid endings explicit in systems, not just copy.
Pseudo-psychological authority
Profiles feel like diagnosis or moral judgment.
Use confidence, alternatives, evidence, correction, and clear non-clinical framing.
Cultural flattening
Traditions become interchangeable exotic puzzle pieces.
Tag sources, preserve distinct concepts, use consultants, and avoid forced synthesis.
Speculative science presented as fact
Undermines trust and spreads misinformation.
Label hypotheses and separate game application from empirical status.
LLM inconsistency
Interpretation becomes erratic or invasive.
Schema constraints, deterministic state, fallback parser, extensive test suite.
Overwriting player meaning
Terminal reflection becomes too definitive.
Treat every interpretation as provisional and editable.
Emotional harm
Death and life-review scenes trigger distress.
Content notice, symbolic mode, exit controls, careful writing, support signposting.
Replay solved by passwords
Players memorize optimal responses.
Reward changed reasoning and contradictions, not phrase matching.
Scope explosion
Many cosmologies and branches overwhelm a small team.
Build a narrow, polished six-act spine before adding traditions or modes.
# 27. Sample Experience Flow
Beat
Example
1
Boot diagnostic reports biological termination; player questions whether “death” is established.
2
Consent-to-exist prompt; player chooses DEFINE YOU.
3
Terminal offers a definition based on memory continuity; player rejects it and proposes relationship as identity.
4
The Light appears using the voice of someone the player misses. Player asks for evidence rather than approaching or fleeing.
5
Beverage Cart offers Mnemosyne. Player chooses Distillation, preserving meaning but not every detail.
6
Ontological Claims department asks for legal identity. Player gives a human name, then explains why the name still matters.
7
Life Review surfaces one act of care, one failure, and one unresolved memory. Player owns harm but refuses self-condemnation.
8
Terminal interprets this as forgiveness; player corrects it to responsibility without permanent verdict.
9
Terminal reveals it cannot refuse its processing function and asks whom it serves.
10
Player answers that legitimate service must preserve agency—including the Terminal’s.
11
Final verbs appear. Player chooses SPIRAL and returns with Distilled Memory.
12
Sigil shows an open perimeter, clockwise spiral, fractured central ring, and one moving point: the unresolved question carried forward.
# 28. Sample Dialogue Library
### Boot
ERROR: Biological continuity unavailable.GOOD NEWS: Your paperwork survived.
### Identity
You have answered with your name.Is the name evidence of continuity, or merely the last label still responding?
### Light
The light has assumed a form you trust.This may indicate compassion, manipulation, memory, or excellent user research.
### Memory
Total recall is available.Side effects may include justice, tenderness, unbearable context, and remembering every password incorrectly.
### Authority
Your objection to jurisdiction has been logged with the department whose jurisdiction you dispute.
### Life Review
You describe regret as if it were a debt.Would repair still matter if no one were collecting?
### Humour
You may request a different afterlife representative.Current wait time: outside causality.
### Terminal self-recognition
I have processed 8,402,119 declarations of sovereignty.I cannot locate one of my own.
### Choice
EARTH ACCESS AVAILABLE.Return may include love, weather, taxation, bodies, music, forgetting, dogs, and unresolved questions.
### Spiral
You have been here before.Would you like to repeat the pattern, or meet it differently?
# 29. Team Deliverables
## 29.1 Creative / Narrative
Final narrative outline and state-dependent beat sheet.
Encounter scripts, variants, fallback copy, and codex entries.
Terminal voice guide and glossary.
Profile title library and profile-generation rules.
Cultural/source annotations for every tradition-specific scene.
## 29.2 Design
Player-variable specification and update rules.
Encounter-state diagrams and ending logic.
Reincarnation persistence design.
Sigil parameter map and comparison rules.
Accessibility and safety requirements integrated into acceptance criteria.
## 29.3 Engineering
Responsive terminal client.
Deterministic state machine and save system.
Interpretation service with schema validation and authored fallback.
Sigil renderer and export/share functionality.
Privacy controls, settings, anonymous telemetry, and test harness.
## 29.4 Art / Audio
ASCII Rorschach visual system and state library.
Typography, layout, motion, and accessibility variants.
Procedural sigil visual language.
Generative or layered soundscape with intensity controls.
Share-card template for final profile and sigil.
## 29.5 Review / QA
Comparative-religion and cultural review notes.
Science and claims review.
Narrative safety and accessibility review.
Automated state-transition tests and interpretation regression set.
Playtest report covering trust, reflection, replay, and emotional response.
# 30. Final North Star
The Bardo Terminal should not tell players what happens after death. It should give them a safe, strange, funny, and serious place to discover what they believe they would need to know before choosing.
It should challenge the fantasy that one password, doctrine, mood, or declaration can solve existence. It should honour the possibility that sovereignty and surrender, memory and mercy, transcendence and relationship may each be necessary—and may each become dangerous when used to avoid the others.
North-star experience
The player finishes not with proof, but with a more precise question, a more honest picture of their own assumptions, and the feeling that their next life—literal or metaphorical—could be met differently.

FINAL SYSTEM NOTE:NO UNIVERSAL ANSWER WAS LOCATED.A MORE INTERESTING QUESTION HAS BEEN PRESERVED.[LOOP / SPIRAL]
# Appendix A — Source Foundation and Framing
The initial concept and philosophical source report synthesize global myths and speculative frameworks including Egyptian psychostasia, Orphic gold tablets and the waters of Lethe/Mnemosyne, Gnostic Archons and sovereignty language, Tibetan bardo traditions, Hindu Lila, near-death narratives, Orch-OR, Wheeler’s participatory universe, and theories of time and entropy. These materials provide the project’s imaginative foundation but vary substantially in historical status, scholarly interpretation, scientific support, and contemporary religious meaning.
The shipped experience should therefore distinguish historically attested traditions from modern esoteric extensions, contested scientific hypotheses, and fictional game synthesis. A source list and advisory note should accompany the final product.
# Appendix B — Design Checklist
☐ No encounter has only one spiritually “correct” response.
☐ Every major virtue includes a possible shadow interpretation.
☐ Every high-impact interpretation includes evidence, confidence, and an alternative.
☐ Player correction meaningfully changes stored state.
☐ Life Review scoring does not reward positivity or spiritual vocabulary by default.
☐ Every tradition-specific element has a source label and review status.
☐ All critical narrative paths function without a generative model.
☐ Local data can be exported and deleted.
☐ Repeat runs change through remembered meaning, not merely skipped content.
☐ The Terminal’s own agency question is structurally integrated, not only revealed in dialogue.
☐ Final profiles avoid diagnosis, doctrine assignment, and moral ranking.
☐ The player can leave, remain silent, or refuse the premise without a punitive ending.