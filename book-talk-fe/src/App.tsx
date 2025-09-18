import {AppRoutes} from "./routes";
import {MuiThemeProvider} from "./providers/MuiThemeProvider.tsx";

function App() {
    return (
        <MuiThemeProvider>
            <AppRoutes/>
        </MuiThemeProvider>
    )
}

export default App;
