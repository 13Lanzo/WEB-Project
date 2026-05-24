import './Home.css'

const Home = () => {
    return (
        <section className='home'>
            <div className='homeContent'>
                <h1 className='homeTitle'>
                    Trova la tua stanza, incontra i tuoi futuri coinquilini
                </h1>
                <p className='homedescription'>
                    Tinder è la piattaforma definitiva per aiutarti a trovare la tua stanza dei sogni. Semplifica la ricerca di alloggi e la selezione dei coinquilini ideali grazie alnostro algoritmo di compatibilità.
                </p>

                <div className='homeButtons'>
                    <button className='btnOne'>
                        <span className='icon'>🔍</span>
                        Inizia la ricerca
                    </button>
                    <button className='btnTwo'>
                        <span className='icon'>🏠</span>
                        Pubblica annuncio
                    </button>
                </div>
            </div>
        </section>
    );
};
export default Home;