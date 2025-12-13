function ThemeShowcase() {
    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold text-text-primary mb-8">Theme Showcase</h1>

            {/* Cards */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-text-secondary">Cards</h2>
                <div className="grid grid-cols-3 gap-4">
                    <div className="glass-card rounded-2xl p-6">
                        <h3 className="text-lg font-medium text-white mb-2">Glass Card</h3>
                        <p className="text-text-tertiary text-sm">Standard glass card with blur effect</p>
                    </div>

                    <div className="glass-card-hover glass-card rounded-2xl p-6 cursor-pointer">
                        <h3 className="text-lg font-medium text-white mb-2">Hover Card</h3>
                        <p className="text-text-tertiary text-sm">Hover me for effect</p>
                    </div>

                    <div className="card">
                        <h3 className="text-lg font-medium text-white mb-2">Utility Card</h3>
                        <p className="text-text-tertiary text-sm">Using Tailwind utility</p>
                    </div>
                </div>
            </section>

            {/* Buttons */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-text-secondary">Buttons</h2>
                <div className="flex flex-wrap gap-3">
                    <button className="btn btn-primary">Primary Button</button>
                    <button className="btn btn-secondary">Secondary Button</button>
                    <button className="btn btn-danger">Danger Button</button>
                    <button className="btn glass-button">Glass Button</button>
                    <button className="btn btn-sm btn-primary">Small Button</button>
                    <button className="btn btn-lg btn-secondary">Large Button</button>
                </div>
            </section>

            {/* Inputs */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-text-secondary">Inputs</h2>
                <div className="space-y-3 max-w-md">
                    <input type="text" placeholder="Standard input" className="input" />
                    <input type="text" placeholder="Small input" className="input-sm" />
                    <input type="password" placeholder="Password" className="input" />
                </div>
            </section>

            {/* Badges */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-text-secondary">Badges</h2>
                <div className="flex flex-wrap gap-2">
                    <span className="badge-blue">Blue Badge</span>
                    <span className="badge-green">Green Badge</span>
                    <span className="badge-red">Red Badge</span>
                    <span className="badge-yellow">Yellow Badge</span>
                </div>
            </section>

            {/* Colors */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-text-secondary">Color Palette</h2>
                <div className="grid grid-cols-4 gap-4">
                    <div className="glass-card rounded-xl p-4">
                        <div className="w-full h-20 bg-background-primary rounded-lg mb-2"></div>
                        <p className="text-xs text-text-tertiary">Background Primary</p>
                    </div>
                    <div className="glass-card rounded-xl p-4">
                        <div className="w-full h-20 bg-accent-blue rounded-lg mb-2"></div>
                        <p className="text-xs text-text-tertiary">Accent Blue</p>
                    </div>
                    <div className="glass-card rounded-xl p-4">
                        <div className="w-full h-20 bg-accent-green rounded-lg mb-2"></div>
                        <p className="text-xs text-text-tertiary">Accent Green</p>
                    </div>
                    <div className="glass-card rounded-xl p-4">
                        <div className="w-full h-20 bg-accent-red rounded-lg mb-2"></div>
                        <p className="text-xs text-text-tertiary">Accent Red</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ThemeShowcase;