import { Match, PropsWithChildren, Switch } from "solid-js";

export function GeoLocationError(props: PropsWithChildren<{
  code: number | null | undefined;
}>) {
  return (
    <Switch fallback={props.children}>
      <Match when={props.code}>
        <div style={{
          margin: "1rem",
          display: "flex",
          "align-items": "center",
        }}>
          <div style={{ "font-size": "3rem" }}>⚠️</div>
          <div style={{ margin: "0.5rem 0 0 0.5rem" }}>
            <Switch>
              <Match when={props.code === GeolocationPositionError.TIMEOUT}>
                <>Timeout tijdens laden van de locatie.<br/>Probeer pagina te refreshen</>
              </Match>
              <Match when={props.code === GeolocationPositionError.POSITION_UNAVAILABLE}>
                <>Locatie informatie is niet beschikbaar.<br/>Probeer pagina te refreshen</>
              </Match>
              <Match when={props.code === GeolocationPositionError.PERMISSION_DENIED}>
                <>Geen toegang tot de locatie informatie.<br/>Controleer of deze pagina rechten heeft tot locatie gegevens</>
              </Match>
            </Switch>
          </div>
        </div>
      </Match>
    </Switch>
  );
}
