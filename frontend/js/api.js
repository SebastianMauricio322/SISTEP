"use strict";

/* ==========================================================================
   SISTEP · Cliente HTTP del contrato INTEGRACION_BACKEND.md v1.0
   - Mismo origen (recomendado): API_BASE = "/api".
   - Puertos separados: definir antes de cargar este archivo
       window.SISTEP_API_BASE = "http://localhost:3000/api";
   ========================================================================== */
(function () {
  const API_BASE = window.SISTEP_API_BASE
    || (window.location.protocol === "file:" ? "http://localhost:3000/api" : "/api");

  const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const pad = (value) => String(value).padStart(2, "0");
  const isoLocal = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

  /* El backend solo envía fechas ISO; las etiquetas visibles se construyen aquí. */
  const format = {
    displayDate(iso) {
      const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ""));
      return match ? `${match[3]}/${match[2]}/${match[1]}` : String(iso || "");
    },
    relativeLabel(iso, time) {
      const today = new Date();
      const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
      if (iso === isoLocal(today)) {
        return `Hoy · ${time}`;
      }
      if (iso === isoLocal(yesterday)) {
        return `Ayer · ${time}`;
      }
      const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ""));
      return match ? `${match[3]} ${MONTHS[Number(match[2]) - 1]} · ${time}` : `${iso} · ${time}`;
    },
    todayIso() {
      return isoLocal(new Date());
    },
    isoDaysAgo(days) {
      const now = new Date();
      return isoLocal(new Date(now.getFullYear(), now.getMonth(), now.getDate() - days));
    }
  };

  async function request(method, path, body) {
    const options = { method, headers: {} };

    if (body !== undefined) {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }

    let response;
    try {
      response = await fetch(API_BASE + path, options);
    } catch (error) {
      throw new Error("No se pudo conectar con el servidor. Verifica que el backend esté activo.");
    }

    if (response.status === 204) {
      return null;
    }

    let data = null;
    try {
      data = await response.json();
    } catch (error) {
      data = null;
    }

    if (!response.ok) {
      // Contrato: { error: { code, message, fields? } }; el toast muestra error.message
      const info = data && data.error ? data.error : {};
      const failure = new Error(info.message || "No se pudo completar la operación.");
      failure.status = response.status;
      failure.code = info.code;
      failure.fields = info.fields;
      throw failure;
    }

    return data;
  }

  const id = encodeURIComponent;

  window.SistepApi = {
    format,
    getDashboard: () => request("GET", "/dashboard"),
    resolverAlertaDashboard: (alertId) => request("PATCH", `/dashboard/alertas/${id(alertId)}`, { status: "Resuelto" }),
    archivarAlertaDashboard: (alertId) => request("DELETE", `/dashboard/alertas/${id(alertId)}`),
    getAlertas: () => request("GET", "/alertas"),
    notificarPnp: (alertId) => request("POST", `/alertas/${id(alertId)}/notificar-pnp`),
    descartarAlerta: (alertId) => request("DELETE", `/alertas/${id(alertId)}`),
    getIncidentes: () => request("GET", "/incidentes"),
    getReportes: (rango) => request("GET", `/reportes?rango=${id(rango)}`),
    getConfiguracion: () => request("GET", "/configuracion"),
    guardarConfiguracion: (config) => request("PUT", "/configuracion", config)
  };
})();
