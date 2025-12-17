-- Clear existing data
DELETE FROM items;
DELETE FROM sections;
DELETE FROM categories;

-- Insert categories
INSERT INTO categories (id, label, icon, description, order_index) VALUES
('shortcuts', 'Shortcuts', 'Keyboard', 'Essential hotkeys for speed.', 1),
('settings', 'Settings', 'Settings', 'Performance and render tweaks.', 2),
('lights', 'Lights', 'Lightbulb', 'Lighting types and setups.', 3),
('topology', 'Topology', 'Grid', 'Edge flow and geometry best practices.', 4),
('nodes', 'Nodes', 'Share2', 'Shader and Geometry nodes reference.', 5),
('experiments', 'Experiments', 'FlaskConical', 'Exploratory Blender studies.', 6),
('components', 'Components', 'Box', 'Reusable 3D building blocks.', 7),
('addons', 'Add-Ons', 'Plug', 'Essential plugins and extensions.', 8),
('todo', 'TODO', 'ListTodo', 'Personal learning checklist.', 9);

-- Insert sections
INSERT INTO sections (id, category_id, title, order_index) VALUES
(1, 'shortcuts', 'Viewport Navigation', 1),
(2, 'shortcuts', 'Object Transformation', 2),
(3, 'shortcuts', 'Modeling Operations', 3),
(4, 'settings', 'Render Engines', 1),
(5, 'settings', 'Performance', 2),
(6, 'lights', 'Light Types', 1),
(7, 'lights', 'Setups', 2),
(8, 'topology', 'Primitives', 1),
(9, 'topology', 'Flow', 2),
(10, 'nodes', 'Shader Nodes', 1),
(11, 'nodes', 'Input Nodes', 2),
(12, 'experiments', 'Environment & Atmosphere', 1),
(13, 'components', 'Hard Surface Kit', 1),
(14, 'addons', 'Essential', 1),
(15, 'todo', 'Learning Path', 1);

-- Insert items - Shortcuts
INSERT INTO items (id, section_id, type, title, description, tags, data, order_index, is_completed) VALUES
('rotate-view', 1, 'shortcut', 'Rotate View', 'Orbit around the scene center or selected object.', ARRAY['nav', 'view'], '{"keys": ["MMB"], "context": "General"}', 1, false),
('pan-view', 1, 'shortcut', 'Pan View', 'Move the view laterally without rotating.', ARRAY['nav', 'move'], '{"keys": ["Shift", "MMB"], "context": "General"}', 2, false),
('zoom-view', 1, 'shortcut', 'Zoom View', 'Move closer or further from the center.', ARRAY['nav', 'zoom'], '{"keys": ["Ctrl", "MMB"], "context": "General"}', 3, false),
('frame-selected', 1, 'shortcut', 'Frame Selected', 'Focus the camera on the selected object(s).', ARRAY['focus', 'nav'], '{"keys": ["Numpad ."], "context": "General"}', 4, false),
('grab-move', 2, 'shortcut', 'Move (Grab)', 'Move the selected object.', ARRAY['transform'], '{"keys": ["G"], "context": "Object Mode"}', 1, false),
('rotate', 2, 'shortcut', 'Rotate', 'Rotate the selected object.', ARRAY['transform'], '{"keys": ["R"], "context": "Object Mode"}', 2, false),
('scale', 2, 'shortcut', 'Scale', 'Scale the selected object.', ARRAY['transform'], '{"keys": ["S"], "context": "Object Mode"}', 3, false),
('apply-transform', 2, 'shortcut', 'Apply Transforms', 'Make current scale/rotation permanent.', ARRAY['fix'], '{"keys": ["Ctrl", "A"], "context": "Object Mode"}', 4, false),
('extrude', 3, 'shortcut', 'Extrude', 'Pull new geometry from a face, edge, or vertex.', ARRAY['model', 'geometry'], '{"keys": ["E"], "context": "Edit Mode"}', 1, false),
('inset', 3, 'shortcut', 'Inset Faces', 'Create a face inside a face.', ARRAY['model', 'geometry'], '{"keys": ["I"], "context": "Edit Mode"}', 2, false),
('bevel', 3, 'shortcut', 'Bevel', 'Round off edges.', ARRAY['model', 'geometry'], '{"keys": ["Ctrl", "B"], "context": "Edit Mode"}', 3, false),
('loop-cut', 3, 'shortcut', 'Loop Cut', 'Add a ring of edges to the mesh.', ARRAY['model', 'topology'], '{"keys": ["Ctrl", "R"], "context": "Edit Mode"}', 4, false);

-- Insert items - Settings
INSERT INTO items (id, section_id, type, title, description, tags, image_url, data, order_index, is_completed) VALUES
('cycles-vs-eevee', 4, 'concept', 'Cycles vs Eevee', 'Choosing the right render engine for your project.', ARRAY['render', 'engine'], 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=1200&q=80', '{"details": ["Cycles: Ray-tracing engine. Physically accurate light bounces. Best for photorealism. Slower.", "Eevee: Real-time rasterization engine (like game engines). Very fast. Good for motion graphics and stylistic looks."]}', 1, false),
('sampling', 4, 'concept', 'Render Samples', 'Controls the quality and noise level of the image.', ARRAY['render', 'performance'], NULL, '{"details": ["Higher samples = less noise, longer render time.", "Viewport samples should be low (32-64) for responsiveness.", "Use \"Noise Threshold\" to automatically stop sampling when an area is clean."]}', 2, false),
('optix-denoising', 5, 'concept', 'OptiX Denoising', 'AI-accelerated denoising for NVIDIA cards.', ARRAY['performance', 'gpu'], NULL, '{"details": ["Enable in Edit > Preferences > System > Cycles Render Devices.", "Greatly speeds up viewport preview."]}', 1, false);

-- Insert items - Lights
INSERT INTO items (id, section_id, type, title, description, tags, image_url, data, order_index, is_completed) VALUES
('point-light', 6, 'concept', 'Point Light', 'Omnidirectional light source, like a lightbulb.', ARRAY['lighting', 'basic'], 'https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?auto=format&fit=crop&w=1200&q=80', '{"details": ["Casts hard shadows if radius is 0, soft if radius is increased.", "Good for lamps, candles, or fill lights."]}', 1, false),
('area-light', 6, 'concept', 'Area Light', 'Emits light from a specific shape (Rectangle, Disk, etc).', ARRAY['lighting', 'studio'], 'https://images.unsplash.com/photo-1604079628040-94301bb21b91?auto=format&fit=crop&w=1200&q=80', '{"details": ["Most realistic for studio setups.", "Larger size = Softer shadows."]}', 2, false),
('three-point', 7, 'concept', '3-Point Lighting', 'Standard studio lighting technique.', ARRAY['lighting', 'setup'], 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80', '{"details": ["Key Light: Main source, brightest, usually at 45 degrees.", "Fill Light: Softer, darker, fills shadows opposite the key.", "Rim Light (Backlight): Behind object, separates it from background."]}', 1, false);

-- Insert items - Topology
INSERT INTO items (id, section_id, type, title, description, tags, image_url, data, order_index, is_completed) VALUES
('quads', 8, 'concept', 'Quads (4-sided)', 'Polygons with exactly 4 vertices.', ARRAY['topology', 'best-practice'], NULL, '{"details": ["The gold standard for subdivision modeling.", "Deforms cleanly for animation.", "loop cuts work predictably."]}', 1, false),
('ngons', 8, 'concept', 'N-Gons (>4 sided)', 'Polygons with more than 4 vertices.', ARRAY['topology', 'warning'], NULL, '{"details": ["Generally avoid on curved surfaces.", "Can cause shading artifacts.", "Okay on flat, hard-surface objects that wont deform."]}', 2, false),
('poles', 9, 'concept', 'Poles (E-Poles & N-Poles)', 'Vertices connected to 3 or 5+ edges.', ARRAY['topology', 'advanced'], 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=1200&q=80', '{"details": ["Necessary to redirect edge flow.", "Try to hide them in flat areas or behind ears/joints.", "Avoid 6+ edge poles (stars) if possible."]}', 1, false);

-- Insert items - Nodes
INSERT INTO items (id, section_id, type, title, description, tags, data, order_index, is_completed) VALUES
('principled-bsdf', 10, 'node', 'Principled BSDF', 'The uber-shader that can create 90% of materials.', ARRAY['material', 'pbr'], '{"inputs": ["Base Color", "Metallic", "Roughness", "IOR", "Alpha", "Normal"], "outputs": ["BSDF"], "category": "Shader"}', 1, false),
('color-ramp', 10, 'node', 'Color Ramp', 'Maps values to colors. Crucial for controlling contrast and masks.', ARRAY['utility', 'color'], '{"inputs": ["Fac (Factor)"], "outputs": ["Color", "Alpha"], "category": "Texture"}', 2, false),
('mix-shader', 10, 'node', 'Mix Shader', 'Blends two shaders together based on a factor.', ARRAY['mix'], '{"inputs": ["Fac", "Shader 1", "Shader 2"], "outputs": ["Shader"], "category": "Shader"}', 3, false),
('tex-coord', 11, 'node', 'Texture Coordinate', 'Determines how textures are mapped onto geometry.', ARRAY['mapping'], '{"inputs": [], "outputs": ["Generated", "Normal", "UV", "Object", "Camera"], "category": "Geometry"}', 1, false);

-- Insert items - Experiments
INSERT INTO items (id, section_id, type, title, description, tags, github_url, image_url, data, order_index, is_completed) VALUES
('nishita-sky', 12, 'concept', 'Nishita Sky Study', 'A deep dive into the Nishita Sky Texture parameters.', ARRAY['world', 'environment', 'lighting'], 'https://github.com/blender/experiments', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80', '{"details": ["Sun Disc: Controls the size of the sun glow.", "Air/Dust/Ozone: Controls scattering and color tint.", "Experiments with time-of-day animation nodes."]}', 1, false);

-- Insert items - Components
INSERT INTO items (id, section_id, type, title, description, tags, github_url, model_url, data, order_index, is_completed) VALUES
('scifi-vent', 13, 'concept', 'Sci-Fi Vent Module', 'A modular ventilation unit for sci-fi corridors.', ARRAY['kitbash', 'scifi', 'asset'], 'https://github.com/blender/kitbash', 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/fbx/StanfordBunny.fbx', '{"details": ["Subdiv-ready topology.", "Includes baked normal maps."]}', 1, false),
('hydraulic-piston', 13, 'concept', 'Hydraulic Piston', 'Rigged piston mechanism for machinery.', ARRAY['mechanical', 'rigging'], 'https://github.com/blender/kitbash', 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/fbx/StanfordBunny.fbx', '{}', 2, false);

-- Insert items - Add-ons
INSERT INTO items (id, section_id, type, title, description, tags, data, order_index, is_completed) VALUES
('node-wrangler', 14, 'concept', 'Node Wrangler', 'The absolute must-have for node editing. Ships with Blender.', ARRAY['plugin', 'essential', 'nodes'], '{"details": ["Ctrl+Shift+Click to preview any node.", "Ctrl+T to add Texture Coordinate + Mapping instantly."]}', 1, false),
('poliigon', 14, 'concept', 'Poliigon Add-on', 'Quickly import high-quality textures and models from Poliigon library.', ARRAY['textures', 'assets', 'plugin'], '{"externalUrl": "https://www.poliigon.com/addon"}', 2, false),
('amt', 14, 'concept', 'AMT Landscape', 'Advanced landscape generation tool for large scale terrains.', ARRAY['terrain', 'environment', 'plugin'], '{"externalUrl": "https://github.com/ant-landscape"}', 3, false);

-- Insert items - TODO
INSERT INTO items (id, section_id, type, title, description, tags, youtube_url, data, order_index, is_completed) VALUES
('donut-tutorial', 15, 'todo', 'Blender Guru Donut Tutorial', 'The rite of passage for every Blender user.', ARRAY['beginner', 'basics'], 'https://youtube.com/playlist?list=PLjEaoINCJup6SHPFXdk1uRVI37s6JG1_C', '{}', 1, true),
('anvil-tutorial', 15, 'todo', 'Anvil Series', 'Intermediate modeling and texturing workflow.', ARRAY['intermediate', 'modeling'], 'https://youtube.com', '{}', 2, false),
('chair-tutorial', 15, 'todo', 'Chair Tutorial', 'Advanced topology and photorealism.', ARRAY['advanced', 'furniture'], 'https://youtube.com', '{}', 3, false),
('geo-nodes-basics', 15, 'todo', 'Geometry Nodes Basics', 'Understanding fields, attributes, and instances.', ARRAY['nodes', 'procedural'], NULL, '{}', 4, false);
