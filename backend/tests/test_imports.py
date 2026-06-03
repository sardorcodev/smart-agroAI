def test_new_backend_package_imports(backend_app):
    import backend.app.main as app_main
    import backend.app.schemas as schemas
    import backend.app.services.analysis as analysis_service

    assert app_main.app.title == "Smart Agro AI API"
    assert schemas.FarmData is not None
    assert callable(analysis_service.analyze_farm_data)
