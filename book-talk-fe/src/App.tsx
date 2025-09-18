import {AppRoutes} from "./routes";
import {MuiThemeProvider, TanStackQueryProvider} from "./providers";

function App() {
    return (
        <MuiThemeProvider>
            <TanStackQueryProvider>
                <AppRoutes/>
            </TanStackQueryProvider>
        </MuiThemeProvider>
    )
}

export default App;
